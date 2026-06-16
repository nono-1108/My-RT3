import { Router } from 'express';
import authRoutes from './auth';
import wargaRoutes from './warga';
import pemasukanRoutes from './pemasukan';
import pengeluaranRoutes from './pengeluaran';
import dashboardRoutes from './dashboard';
import iuranRoutes from './iuran';
import laporanRoutes from './laporan';
import saldoAwalRoutes from './saldoAwal';
import usersRoutes from './users';
import kategoriRoutes from './kategori';

const router = Router();

router.use('/auth', authRoutes);
router.use('/warga', wargaRoutes);
router.use('/pemasukan', pemasukanRoutes);
router.use('/pengeluaran', pengeluaranRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/iuran', iuranRoutes);
router.use('/laporan', laporanRoutes);
router.use('/saldo-awal', saldoAwalRoutes);
router.use('/users', usersRoutes);
router.use('/kategori', kategoriRoutes);

export default router;
