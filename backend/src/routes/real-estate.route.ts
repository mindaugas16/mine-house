import { Router } from 'express';
import { RealEstateController } from '../controllers';

const router = Router();

router.get('/', RealEstateController.getRealEstates);
router.get('/:id', RealEstateController.getSingleRealEstate);
router.get('/autocomplete', RealEstateController.autocomplete);
// router.post('/', RealEstateController.postRealEstates);
router.patch('/:id/mark-as-seen', RealEstateController.markAsSeen);
router.patch('/:id/favorite', RealEstateController.favorite);
router.delete('/:id/delete', RealEstateController.delete);

export default router;
