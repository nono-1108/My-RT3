import { Router } from 'express';
import { exportLaporanKasExcel, exportLaporanKasPDF, getLaporanKumulatif, getLaporanBulanan } from '../controllers/laporan';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/excel', exportLaporanKasExcel);
router.get('/pdf', exportLaporanKasPDF);
router.get('/kumulatif', getLaporanKumulatif);
router.get('/bulanan', getLaporanBulanan);


export default router;
