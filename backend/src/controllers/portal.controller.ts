import { NextFunction, Request, Response } from 'express';
import Portal, { PortalInterface } from '../models/portal.model';
import RealEstate from '../models/real-estate.model';
import { Sequelize } from 'sequelize';

export default {
  getSupportedPortalsAsFilters: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchId: crawlerId } = req.query;

      const rows = await Portal.findAll({
        where: { active: true },
        order: [['title', 'asc']],
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('realEstates.id')), 'realEstatesCount']],
        },
        include: [{ model: RealEstate, attributes: [], where: { crawlerId } }],
        group: ['portals.id'],
      });
      res.send(rows);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  addPortal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const portal = await Portal.create(req.body);
      res.send(portal);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

export function getActivePortals(): Promise<PortalInterface[]> {
  return Portal.findAll({
    where: { active: true },
  });
}
