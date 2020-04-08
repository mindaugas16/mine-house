import express from 'express';
import RealEstate from './real-estate.route';
import { CrawlerController } from '../controllers';

const router = express.Router();

router.use('/real-estate', RealEstate);
router.post('/run-crawler', CrawlerController.run);

export default router;
