import { Router } from 'express';
import { 
  getKategoriPemasukan, createKategoriPemasukan, updateKategoriPemasukan, deleteKategoriPemasukan,
  getKategoriPengeluaran, createKategoriPengeluaran, updateKategoriPengeluaran, deleteKategoriPengeluaran
} from '../controllers/kategori';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

// Kategori Pemasukan
router.get('/pemasukan', getKategoriPemasukan);
router.post('/pemasukan', createKategoriPemasukan);
router.put('/pemasukan/:id', updateKategoriPemasukan);
router.delete('/pemasukan/:id', deleteKategoriPemasukan);

// Kategori Pengeluaran
router.get('/pengeluaran', getKategoriPengeluaran);
router.post('/pengeluaran', createKategoriPengeluaran);
router.put('/pengeluaran/:id', updateKategoriPengeluaran);
router.delete('/pengeluaran/:id', deleteKategoriPengeluaran);

export default router;
