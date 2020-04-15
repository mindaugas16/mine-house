import { NextFunction, Request, Response } from 'express';
import RealEstate, { RealEstateInterface } from '../models/real-estate.model';
import Portal from '../models/portal.model';
import { download } from '../utilities/downloader';
import crypto from 'crypto-js';
import { Op, Sequelize } from 'sequelize';

const SHOW_PER_PAGE = 12;

export default {
  getRealEstates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, property, direction, portals, groupBy } = req.query;
      let portalCondition = {};
      let order: any[] = [];
      if (portals) {
        portalCondition = { name: portals.split(',') };
      }
      if (groupBy) {
        order.push([groupBy, 'desc']);
      }
      order.push([[property || 'updatedAt', direction || 'desc']]);
      const currentPage = page || 1;
      const { rows, count } = await RealEstate.findAndCountAll({
        order,
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
      const [_, rows] = await RealEstate.update({ new: false, lastSeenAt: Date.now() }, { where: { id }, returning: true });
      const [row] = rows;
      res.send(row);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  postRealEstates: async (req: Request, res: Response, next: NextFunction) => {
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
            if (item.imageUrl) {
              const filename = crypto.MD5(`${newItem.title}${newItem.createdAt}`);
              const fileExtension = item.imageUrl.split('.').pop();

              const imagePath = `images/real-estates/${filename}.${fileExtension}`;

              download(item.imageUrl, imagePath, () => {});
              newItem.imagePath = imagePath;
            }
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
          res.status(400).json({ err, message: 'something went wrong' });
        }
      });
    }

    const realEstates: RealEstateInterface[] = req.body;
    const promises: Promise<any>[] = [];
    realEstates.forEach(item => promises.push(runUpdate(item)));
    try {
      await Promise.all(promises);
      res.send({ message: 'Data update successfully' });
    } catch (err) {
      res.status(400).json({ err, message: 'something went wrong' });
    }
  },
};

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
