import { Router } from 'express';
import { CrawlerController } from '../controllers';

const router = Router();

router.get('/', CrawlerController.getAll);
router.put('/', CrawlerController.create);
// router.get('/:id', CrawlerController.delete);
router.delete('/:id', CrawlerController.delete);
router.post('/:id/run', CrawlerController.run);

export default router;
