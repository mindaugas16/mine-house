import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import Crawler from '../models/crawler.model';
import Portal from '../models/portal.model';
import { postRealEstates } from './real-estate.controller';
import { Sequelize } from 'sequelize';
import RealEstate from '../models/real-estate.model';

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
      const crawlers = await Crawler.findAll({
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('realEstates.id')), 'realEstatesCount']],
        },
        include: [{ model: RealEstate, attributes: [] }],
        group: ['crawlers.id'],
        order: [['createdAt', 'desc']],
      });
      res.send(crawlers);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await Crawler.destroy({ where: { id } });
      res.status(204).send();
    } catch (err) {
      res.status(400).json(err);
    }
  },
  run: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const portals = await Portal.findAll({ attributes: ['name'], where: { active: true } });
      const crawlerOptions = await Crawler.findOne({ where: { id } });
      if (!crawlerOptions) {
        throw new Error(`Unable to find crawler with id ${id}`);
      }
      // let totalItemsCount = 0;
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
          const promiseResults = (await postRealEstates(realEstates)) as boolean[];
          return promiseResults.filter(v => v).length;
        }
      });
      const promisesResults = await Promise.all(promises);

      res.send({ newItems: promisesResults.reduce((a, b) => (a || 0) + (b || 0), 0) });
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  },
};
