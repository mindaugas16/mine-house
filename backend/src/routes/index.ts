import express from 'express';
import RealEstateRoutes from './real-estate.route';
import PortalRoutes from './portal.route';
import { CrawlerController } from '../controllers';
import path from 'path';

const router = express.Router();

router.use('/real-estates', RealEstateRoutes);
router.use('/portals', PortalRoutes);
router.use('/assets/images', express.static(path.join(__dirname, '../assets/images')));
router.post('/run-crawler', CrawlerController.run);

export default router;
