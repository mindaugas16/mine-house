import express from 'express';
import RealEstateRoutes from './real-estate.route';
import PortalRoutes from './portal.route';
import { CrawlerController } from '../controllers';
import path from 'path';

const router = express.Router();

router.use('/real-estates', RealEstateRoutes);
router.use('/portals', PortalRoutes);
router.get('/run-crawler', CrawlerController.run);

router.use('/assets/images', express.static(path.join(__dirname, '../../public/assets/images')));

export default router;
