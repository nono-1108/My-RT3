import { Router } from 'express';
import {
  getPengeluaran, createPengeluaran, updatePengeluaran, deletePengeluaran,
  getKategoriPengeluaran, createKategoriPengeluaran
} from '../controllers/pengeluaran';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/kategori', getKategoriPengeluaran);
router.post('/kategori', authorize(['ADMIN', 'BENDAHARA']), createKategoriPengeluaran);

router.get('/', getPengeluaran);
router.post('/', authorize(['ADMIN', 'BENDAHARA']), createPengeluaran);
router.put('/:id', authorize(['ADMIN', 'BENDAHARA']), updatePengeluaran);
router.delete('/:id', authorize(['ADMIN', 'BENDAHARA']), deletePengeluaran);

export default router;
