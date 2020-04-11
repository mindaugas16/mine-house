import { Router } from 'express';
import { PortalController } from '../controllers';

const router = Router();

router.get('/', PortalController.getSupportedPortalsAsFilters);
router.post('/', PortalController.addPortal);

export default router;
