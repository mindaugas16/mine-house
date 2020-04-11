import { NextFunction, Request, Response } from 'express';
import RealEstates, { RealEstateInterface } from '../models/real-estate.model';
import Portals from '../models/portal.model';
import { download } from '../utilities/downloader';
import crypto from 'crypto-js';

const SHOW_PER_PAGE = 12;

export default {
  getRealEstates: (req: Request, res: Response, next: NextFunction) => {
    const { page, property, direction, portals } = req.query;
    let condition = {};
    if (portals) {
      condition = { provider: { $in: portals.split(',') } };
    }
    const currentPage = page || 1;
    RealEstates.find(condition)
      .sort({ [property || 'updatedAt']: direction || 'desc' })
      .skip((currentPage - 1) * SHOW_PER_PAGE)
      .limit(SHOW_PER_PAGE)
      .populate('portal')
      .then(realEstates => {
        RealEstates.find(condition).countDocuments({}, (err, count) => {
          const totalPages = Math.ceil(count / SHOW_PER_PAGE) || 1;

          const body = {
            data: realEstates,
            meta: {
              totalPages,
              currentPage,
              showPerPage: SHOW_PER_PAGE,
              totalCount: count,
            },
          };
          res.send(body);
        });
      })
      .catch(err => res.status(400).json(err));
  },
  markAsStarred: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { starred } = req.body;

    RealEstates.findOneAndUpdate({ _id: id }, { starred }, { new: true })
      .then(item => res.status(204).send())
      .catch(err => res.status(400).json(err));
  },
  markAsSeen: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    RealEstates.findOneAndUpdate({ _id: id }, { new: false, lastSeenAt: Date.now() }, { new: true })
      .then(item => {
        if (!item) {
          throw new Error(`Unable to find real estate with id ${id}`);
        }
        return res.send({ _id: item._id, new: item.new, lastSeenAt: item.lastSeenAt });
      })
      .catch(err => res.status(400).json(err));
  },
  postRealEstates: (req: Request, res: Response, next: NextFunction) => {
    function runUpdate(item: any) {
      return new Promise(async (resolve, reject) => {
        const portalLink = definePortalByLink(item.link);
        const portal = await Portals.findOne({ link: { $regex: portalLink, $options: 'i' } });

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
          portal: portal ? portal._id : null,
          createdAt: Date.now(),
          updatedAt: Date.now(), // @TODO: on new model create updatedAt confuses in sorting, remove this line
        };
        RealEstates.findOne({ link: item.link })
          .then(foundItem => {
            if (!foundItem) {
              if (item.imageUrl) {
                const filename = crypto.MD5(`${newItem.title}${newItem.createdAt}`);
                const fileExtension = item.imageUrl.split('.').pop();

                const imagePath = `images/real-estates/${filename}.${fileExtension}`;

                download(item.imageUrl, imagePath, () => {});
                newItem.imagePath = imagePath;
              }
              return resolve(new RealEstates(newItem).save());
            }
            let body = {};
            if (foundItem.price !== newItem.price) {
              const priceChangePercentage = ((foundItem.price - newItem.price) * 100) / foundItem.price;
              body = {
                ...body,
                price: newItem.price,
                priceChangePercentage: Math.abs(+priceChangePercentage.toFixed(2)),
                priceChange: priceChangePercentage > 0 ? 0 : 1,
                $push: {
                  lastPriceChanges: {
                    priceChangeFrom: foundItem.price,
                    priceChangeTo: newItem.price,
                    changedAt: Date.now(),
                  },
                },
              };
            }

            if (foundItem.area !== newItem.area) {
              body = { ...body, area: newItem.area };
            }

            if (!Object.keys(body).length) {
              return resolve();
            }
            body = { ...body, updatedAt: Date.now() };
            return resolve(RealEstates.findOneAndUpdate({ link: item.link }, body));
          })
          .then(() => resolve())
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    }

    const realEstates: RealEstateInterface[] = req.body;

    const promises: Promise<any>[] = [];

    realEstates.forEach(item => promises.push(runUpdate(item)));

    Promise.all(promises)
      .then(() => res.send({ message: 'Data update successfully' }))
      .catch(err => res.status(400).json({ err, message: 'something went wrong' }));
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
  return +value.replace(/[^0-9\n]/g, '');
}
