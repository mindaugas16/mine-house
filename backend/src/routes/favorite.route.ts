import { Router } from 'express';
import { RealEstateController } from '../controllers';

const router = Router();

router.get('/', RealEstateController.getFavorites);

export default router;
