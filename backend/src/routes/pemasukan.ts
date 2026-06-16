import { Router } from 'express';
import {
  getPemasukan, createPemasukan, updatePemasukan, deletePemasukan,
  getKategoriPemasukan, createKategoriPemasukan
} from '../controllers/pemasukan';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/kategori', getKategoriPemasukan);
router.post('/kategori', authorize(['ADMIN', 'BENDAHARA']), createKategoriPemasukan);

router.get('/', getPemasukan);
router.post('/', authorize(['ADMIN', 'BENDAHARA']), createPemasukan);
router.put('/:id', authorize(['ADMIN', 'BENDAHARA']), updatePemasukan);
router.delete('/:id', authorize(['ADMIN', 'BENDAHARA']), deletePemasukan);

export default router;
