import { NextFunction, Request, Response } from 'express';
import fetch from 'node-fetch';
import Portal from '../models/portal.model';
import { postRealEstates } from './real-estate.controller';

export default {
  run: async (req: Request, res: Response, next: NextFunction) => {
    const portals = await Portal.findAll({ attributes: ['name'], where: { active: true } });
    try {
      const response = await fetch(`http://${process.env.CRAWLER_HOST}:5000/run`, {
        method: 'POST',
        body: JSON.stringify({ portals: portals.map(({ name }) => name) }),
        headers: { 'Content-Type': 'application/json' },
      });
      const realEstates = await response.json();
      await postRealEstates(realEstates);
      res.send({ message: `Crawling done. Total results crawled ${realEstates.length}` });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};
