import express from 'express';
import RealEstateRoutes from './real-estate.route';
import PortalRoutes from './portal.route';
import CrawlerRoutes from './crawler.route';
import FavoriteRoute from './favorite.route';
import path from 'path';

const router = express.Router();

router.use('/real-estates', RealEstateRoutes);
router.use('/portals', PortalRoutes);
router.use('/favorite', FavoriteRoute);
router.use('/crawlers', CrawlerRoutes);

router.use('/assets/images', express.static(path.join(__dirname, '../../public/assets/images')));

export default router;
