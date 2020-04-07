import { NextFunction, Request, Response } from 'express';
import RealEstates, { RealEstateInterface, RealEstateProvider } from '../models/real-estate.model';

const SHOW_PER_PAGE = 12;

export default {
  getRealEstates: (req: Request, res: Response, next: NextFunction) => {
    const { page } = req.query;

    RealEstates.find()
      .sort({ updatedAt: -1 })
      .skip(((page || 1) - 1) * SHOW_PER_PAGE)
      .limit(SHOW_PER_PAGE)
      .then(realEstates => {
        RealEstates.find().countDocuments({}, (err, count) => {
          const totalPages = Math.ceil(count / SHOW_PER_PAGE) || 1;

          const body = {
            data: realEstates,
            meta: {
              totalPages,
              currentPage: page,
              showPerPage: SHOW_PER_PAGE,
              totalCount: count,
            },
          };
          res.send(body);
        });
      })
      .catch(err => res.status(400).json(err));
  },
  markAsSeen: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    RealEstates.findOneAndUpdate({ _id: id }, { new: false, lastSeenAt: Date.now() })
      .then(item => res.send(item))
      .catch(err => res.status(400).json(err));
  },
  postRealEstates: (req: Request, res: Response, next: NextFunction) => {
    // @TODO: dont update not actually updated documents
    const runUpdate = (item: any) => {
      return new Promise((resolve, reject) => {
        const newItem = {
          ...item,
          price: +item.price.replace(/[^0-9\n]/g, ''),
          area: +item.area.replace(/[^0-9.\n]/g, ''),
          priceChangePercentage: item.priceChangePercentage
            ? +item.priceChangePercentage
                .toString()
                .replace(',', '.')
                .replace(/[^0-9.\n]/g, '')
            : null,
          new: true,
          provider: defineProviderByLink(item.link),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        RealEstates.findOne({ link: item.link })
          .then(foundItem => {
            if (!foundItem) {
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
    };

    const realEstates: RealEstateInterface[] = req.body;

    const promises: Promise<any>[] = [];

    realEstates.forEach(item => promises.push(runUpdate(item)));

    Promise.all(promises)
      .then(() => res.send({ message: 'Data update successfully' }))
      .catch(err => res.status(400).json({ err, message: 'something went wrong' }));
  },
};

function defineProviderByLink(link: string): RealEstateProvider | null {
  if (link.indexOf('domoplius') > -1) {
    return RealEstateProvider.DOMOPLIUS;
  }

  if (link.indexOf('aruodas') > -1) {
    return RealEstateProvider.ARUODAS;
  }
  return null;
}
