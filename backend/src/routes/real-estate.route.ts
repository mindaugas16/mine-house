import { Router } from 'express';
import { RealEstateController } from '../controllers';

const router = Router();

router.get('/', RealEstateController.getRealEstates);
router.post('/', RealEstateController.postRealEstates);
router.patch('/:id', RealEstateController.markAsSeen);

export default router;
