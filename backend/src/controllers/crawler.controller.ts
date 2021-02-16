import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import Crawler from '../models/crawler.model';
import Portal from '../models/portal.model';
import { postRealEstates } from './real-estate.controller';

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crawler = await Crawler.create(req.body);
      res.send(crawler);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crawlers = await Crawler.findAll({});
      res.send(crawlers);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  run: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { crawlerId } = req.body;
      const portals = await Portal.findAll({ attributes: ['name'], where: { active: true } });
      const crawlerOptions = await Crawler.findOne({ where: { id: crawlerId } });
      if (!crawlerOptions) {
        throw new Error(`Unable to find crawler with id ${crawlerId}`);
      }
      let totalItemsCount = 0;
      const promises = portals.map(async ({ name }) => {
        const response = await fetch(`http://${process.env.CRAWLER_HOST}:${process.env.CRAWLER_PORT}/run`, {
          method: 'POST',
          body: JSON.stringify({ portals: [name], options: crawlerOptions }),
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
      });
      await Promise.all(promises);

      res.send({ message: `Crawling done. Total results crawled ${totalItemsCount}` });
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },
};
