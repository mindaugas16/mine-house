import { Router } from 'express';
import { RealEstateController } from '../controllers';

const router = Router();

router.get('/', RealEstateController.getRealEstates);
// router.post('/', RealEstateController.postRealEstates);
router.patch('/:id/mark-as-seen', RealEstateController.markAsSeen);
router.patch('/:id/mark-as-starred', RealEstateController.markAsStarred);

export default router;
