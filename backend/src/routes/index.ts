import express from 'express';
import RealEstate from './real-estate.route';

const router = express.Router();

router.use('/real-estate', RealEstate);

export default router;
