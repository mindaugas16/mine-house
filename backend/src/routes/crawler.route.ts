import { Router } from 'express';
import { CrawlerController } from '../controllers';

const router = Router();

router.get('/', CrawlerController.getAll);
router.put('/', CrawlerController.create);
router.post('/run', CrawlerController.run);

export default router;
