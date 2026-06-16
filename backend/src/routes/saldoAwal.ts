import express from 'express';
import { getSaldoAwal, createSaldoAwal, updateSaldoAwal, deleteSaldoAwal } from '../controllers/saldoAwal';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getSaldoAwal);
router.post('/', authorize(['ADMIN']), createSaldoAwal);
router.put('/:id', authorize(['ADMIN']), updateSaldoAwal);
router.delete('/:id', authorize(['ADMIN']), deleteSaldoAwal);

export default router;
