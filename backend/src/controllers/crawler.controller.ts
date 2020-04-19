import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import Portal from '../models/portal.model';
import { postRealEstates } from './real-estate.controller';

export default {
  run: async (req: Request, res: Response, next: NextFunction) => {
    const portals = await Portal.findAll({ attributes: ['name'], where: { active: true } });
    try {
      let totalItemsCount = 0;
      const promises = portals.map(async ({ name }) => {
        const response = await fetch(`http://${process.env.CRAWLER_HOST}:5000/run`, {
          method: 'POST',
          body: JSON.stringify({ portals: [name] }),
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.status >= 400 && response.status < 600) {
          throw new Error('Something went wrong in crawler');
        }
        const realEstates = await response.json();
        if (realEstates && realEstates.length) {
          await postRealEstates(realEstates);
        }
        totalItemsCount += realEstates.length;
      })
      await Promise.all(promises);

      res.send({ message: `Crawling done. Total results crawled ${totalItemsCount}` });
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },
};
