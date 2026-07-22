import { Router } from 'express';
import { getTagihan, generateTagihan, bayarTagihan } from '../controllers/iuran.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getTagihan);
router.post('/generate', authorize(['ADMIN', 'BENDAHARA']), generateTagihan);
router.post('/:id/bayar', authorize(['ADMIN', 'BENDAHARA']), bayarTagihan);

export default router;
