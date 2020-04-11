import { NextFunction, Request, Response } from 'express';
import Portals from '../models/portal.model';

export default {
  getSupportedPortalsAsFilters: (req: Request, res: Response, next: NextFunction) => {
    Portals.find({ active: true })
      .then(portals => {
        res.send(portals);
      })
      .catch(err => res.status(400).json(err));
  },
  addPortal: (req: Request, res: Response, next: NextFunction) => {
    new Portals(req.body)
      .save()
      .then(portal => {
        res.send(portal);
      })
      .catch(err => res.status(400).json(err));
  },
};
