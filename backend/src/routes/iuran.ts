import { Router } from 'express';
import { getTagihan, generateTagihan, bayarTagihan } from '../controllers/iuran';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTagihan);
router.post('/generate', authorize(['ADMIN', 'BENDAHARA']), generateTagihan);
router.post('/:id/bayar', authorize(['ADMIN', 'BENDAHARA']), bayarTagihan);

export default router;
