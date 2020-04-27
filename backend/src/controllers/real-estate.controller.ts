import { NextFunction, Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import RealEstate, { RealEstateInterface } from '../models/real-estate.model';
import Portal from '../models/portal.model';
import { getActivePortals } from './portal.controller';

const SHOW_PER_PAGE = 12;
const SUGGESTIONS_LIMIT = 7;

export default {
  getRealEstates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, property, direction, portals, groupBy, term } = req.query;
      let portalCondition = {};
      let condition = {};
      let order: any[] = [];
      if (portals) {
        // @TODO: check if portal is active before filtering
        portalCondition = { name: portals.split(',') };
      } else {
        const activePortals = await getActivePortals();
        portalCondition = { name: activePortals.map(({ name }) => name) };
      }
      if (groupBy) {
        order.push([groupBy, 'desc']);
      }
      if (term) {
        condition = { title: { [Op.iLike]: `%${term}%` } };
      }
      order.push([[property || 'updatedAt', direction || 'desc']]);
      const currentPage = page || 1;
      const { rows, count } = await RealEstate.findAndCountAll({
        order,
        where: condition,
        limit: SHOW_PER_PAGE,
        offset: (currentPage - 1) * SHOW_PER_PAGE,
        include: [
          {
            model: Portal,
            as: 'portal',
            where: portalCondition,
          },
        ],
      });
      const totalPages = Math.ceil(count / SHOW_PER_PAGE) || 1;

      const body = {
        data: rows,
        meta: {
          totalPages,
          currentPage,
          showPerPage: SHOW_PER_PAGE,
          totalCount: count,
        },
      };
      res.send(body);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  markAsStarred: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { starred } = req.body;

    try {
      await RealEstate.update({ starred }, { where: { id } });
      res.status(204).send();
    } catch (err) {
      res.status(400).json(err);
    }
  },
  markAsSeen: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const [_, rows] = await RealEstate.update(
        { new: false, lastSeenAt: Date.now() },
        {
          where: { id },
          returning: true,
        }
      );
      const [row] = rows;
      res.send(row);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  autocomplete: async (req: Request, res: Response, next: NextFunction) => {
    const { term } = req.query;
    try {
      const suggestions = await RealEstate.findAll({
        where: { title: { [Op.iLike]: `%${term}%` } },
        attributes: ['title'],
        limit: SUGGESTIONS_LIMIT,
      });
      res.send([...new Set(suggestions.map(({ title }) => title))]);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

// @TODO: get matched words
// const matchedTitles = await RealEstate.findAll({
//   where: { title: { [Op.iLike]: `%${term}%` } },
//   attributes: ['title'],
//   limit: SUGGESTIONS_LIMIT,
// });
// const regex = new RegExp('\\b(\\w*' + term + '\\w*)(ą|č|ę|ė|į|š|ų|ū|ž)\\b', 'ig');
// const suggestions = [...new Set(matchedTitles)].reduce((acc: string[], item: { title: string }) => {
//   console.log(item.title);
//   console.log(item.title.match(regex));
//   const matches: any = item.title.match(regex);
//   if (!(matches && matches.length)) {
//     return acc;
//   }
//   acc.push(...matches);
//   return acc;
// }, []);
// console.log(suggestions);
// res.send([...new Set(suggestions)]);

function definePortalByLink(link: string): string {
  // @TODO: update regex to cover www. and other url cases https://nodejs.org/api/url.html
  const matches = link.replace('www.', '').match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  if (!(matches && matches.length)) {
    throw new Error('Unable identify portal');
  }
  return matches[1];
}

function convertToNumber(value: string): number {
  if (value.indexOf('-') > -1) {
    value = value.split('-')[1];
  }
  if (value.indexOf(',') > -1) {
    value = value.split(',')[0];
  }
  if (value.indexOf('.') > -1) {
    value = value.split('.')[0];
  }
  return +value.replace(/[^0-9\n]/g, '');
}

export async function postRealEstates(realEstates: RealEstateInterface[]) {
  return new Promise(async (resolve, reject) => {
    try {
      const promises: Promise<any>[] = [];
      realEstates.forEach(item => promises.push(runUpdate(item)));
      await Promise.all(promises);
      resolve({ message: 'Data update successfully' });
    } catch (err) {
      reject(err);
    }
  });
}

async function runUpdate(item: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const portalLink = definePortalByLink(item.link);
      const portal = await Portal.findOne({ where: { link: { [Op.iLike]: `%${portalLink}%` } } });

      if (!portal) {
        reject(new Error('Unable to identify portal'));
        return;
      }

      const newItem: RealEstateInterface = {
        ...item,
        price: convertToNumber(item.price),
        area: convertToNumber(item.area),
        priceChangePercentage: item.priceChangePercentage
          ? +item.priceChangePercentage
              .toString()
              .replace(',', '.')
              .replace(/[^0-9.\n]/g, '')
          : null,
        new: true,
        portalId: portal.id,
        createdAt: Date.now(),
      };
      const foundItem = await RealEstate.findOne({ where: { link: item.link } });
      if (!foundItem) {
        newItem.imagePath = item.imageUrl || null;
        resolve(RealEstate.create(newItem));
        return;
      }
      let body = {};
      if (foundItem.price !== newItem.price) {
        const priceChangePercentage = +(((foundItem.price - newItem.price) * 100) / foundItem.price).toFixed(2);
        body = {
          ...body,
          price: newItem.price,
          lastPriceChanges: Sequelize.fn(
            'array_append',
            Sequelize.col('lastPriceChanges'),
            JSON.stringify({
              priceBefore: foundItem.price,
              priceAfter: newItem.price,
              priceChangePercentage,
              changedAt: Date.now(),
            })
          ),
        };
      }

      if (foundItem.area !== newItem.area) {
        body = { ...body, area: newItem.area };
      }

      if (!Object.keys(body).length) {
        return resolve();
      }
      body = { ...body, updatedAt: Date.now(), lastSeenAt: null };
      const found = await RealEstate.update(body, { where: { link: item.link } });
      resolve(found);
    } catch (err) {
      reject({ err, message: 'something went wrong' });
    }
  });
}
