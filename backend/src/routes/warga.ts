import { Router } from 'express';
import { getWarga, getWargaById, createWarga, updateWarga, deleteWarga } from '../controllers/warga';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getWarga);
router.get('/:id', getWargaById);
router.post('/', authorize(['ADMIN', 'RT', 'SEKRETARIS']), createWarga);
router.put('/:id', authorize(['ADMIN', 'RT', 'SEKRETARIS']), updateWarga);
router.delete('/:id', authorize(['ADMIN', 'RT', 'SEKRETARIS']), deleteWarga);

export default router;
