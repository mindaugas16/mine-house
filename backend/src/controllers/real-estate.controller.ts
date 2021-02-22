import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import RealEstate, { RealEstateResponseBody } from '../models/real-estate.model';
import Portal from '../models/portal.model';
import Crawler from '../models/crawler.model';
import { getActivePortals } from './portal.controller';
import Price from '../models/price.model';
import Favorite from '../models/favorite.model';

const SHOW_PER_PAGE = 12;
const SUGGESTIONS_LIMIT = 7;

enum sortType {
  'NEWEST' = 'newest',
  'UPDATE' = 'update',
  'CHEAPEST' = 'cheapest',
  'EXPENSIVE' = 'expensive',
}

export default {
  getRealEstates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, property, portals, term, searchId } = req.query;
      let portalCondition = {};
      let condition = {};
      const order: any[] = [];
      if (portals) {
        // @TODO: check if portal is active before filtering
        portalCondition = { name: portals.split(',') };
      } else {
        const activePortals = await getActivePortals();
        portalCondition = { name: activePortals.map(({ name }) => name) };
      }
      if (term) {
        condition = { title: { [Op.iLike]: `%${term}%` } };
      }
      if (searchId) {
        condition = { crawlerId: searchId };
      }
      switch (property) {
        case sortType.UPDATE:
          order.push(['updatedAt', 'desc NULLS LAST']);
          break;
        case sortType.CHEAPEST:
          order.push(['price', 'asc']);
          break;
        case sortType.EXPENSIVE:
          order.push(['price', 'desc']);
          break;
        default:
          order.push(['createdAt', 'desc']);
          break;
      }
      const currentPage = page || 1;
      const { rows, count } = await RealEstate.findAndCountAll({
        include: [
          {
            model: Portal,
            as: 'portal',
            where: portalCondition,
          },
          {
            model: Crawler,
            as: 'crawler',
          },
          {
            model: Favorite,
            as: 'favorite',
          },
          {
            model: Price,
            as: 'priceChanges',
            separate: true,
            order: [['createdAt', 'desc']],
          },
        ],
        order,
        where: condition,
        limit: SHOW_PER_PAGE,
        offset: (currentPage - 1) * SHOW_PER_PAGE,
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
  getFavorites: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rows = await Favorite.findAll({
        include: [
          {
            model: RealEstate,
            as: 'realEstate',
            include: [
              {
                model: Portal,
                as: 'portal',
              },
              {
                model: Crawler,
                as: 'crawler',
              },
              {
                model: Favorite,
                as: 'favorite',
              },
              {
                model: Price,
                as: 'priceChanges',
                separate: true,
                order: [['createdAt', 'desc']],
              },
            ],
          },
        ],
      });

      res.send(rows);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  getSingleRealEstate: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const realEstate = await RealEstate.findOne({
        include: [
          {
            model: Portal,
            as: 'portal',
          },
          {
            model: Crawler,
            as: 'crawler',
          },
          {
            model: Favorite,
            as: 'favorite',
          },
          {
            model: Price,
            as: 'priceChanges',
            separate: true,
            order: [['createdAt', 'desc']],
          },
        ],
        where: { id },
      });
      console.log();
      res.send(realEstate);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  favorite: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
      if (favorite) {
        await Favorite.create({ realEstateId: id });
      } else {
        await Favorite.destroy({ where: { realEstateId: id } });
      }
      res.status(204).send();
    } catch (err) {
      res.status(400).json(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await RealEstate.destroy({ where: { id } });
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

export async function postRealEstates(realEstates: RealEstateResponseBody[]): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const promises: Promise<any>[] = [];
      realEstates
        .filter((item, index, self) => {
          return index === self.findIndex(t => t.crawlerId === item.crawlerId && t.link === item.link);
        })
        .forEach(item => promises.push(runUpdate(item)));
      const newItems = await Promise.all(promises);
      resolve(newItems);
    } catch (err) {
      reject(err);
    }
  });
}

async function runUpdate(item: RealEstateResponseBody): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const portalLink = definePortalByLink(item.link);
      const portal = await Portal.findOne({ where: { link: { [Op.iLike]: `%${portalLink}%` } } });

      if (!portal) {
        reject(new Error('Unable to identify portal'));
        return;
      }
      const newPrice = convertToNumber(item.price);

      const newItem: any = {
        ...item,
        area: convertToNumber(item.area),
        price: newPrice,
        new: true,
        portalId: portal.id,
        crawlerId: item.crawlerId,
        createdAt: Date.now(),
      };
      // Create new entry
      const foundRealEstate = await RealEstate.findOne({ where: { link: item.link, crawlerId: item.crawlerId } });
      if (!foundRealEstate) {
        newItem.imagePath = item.imageUrl || null;
        const realEstate = await RealEstate.create(newItem);
        await Price.create({ realEstateId: realEstate.id, price: newPrice });
        resolve(true);
        return;
      }
      // Update existing entry
      if (newPrice !== foundRealEstate.price) {
        await RealEstate.update(
          {
            price: newPrice,
            updatedAt: Date.now(),
            new: false,
          },
          { where: { id: foundRealEstate.id } }
        );
        await Price.create({
          realEstateId: foundRealEstate.id,
          price: newPrice,
        });
      }
      resolve(false);
    } catch (err) {
      reject({ err, message: 'something went wrong' });
    }
  });
}
