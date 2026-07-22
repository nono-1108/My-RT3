import { Router } from 'express';
import authRoutes from './auth.js';
import wargaRoutes from './warga.js';
import pemasukanRoutes from './pemasukan.js';
import pengeluaranRoutes from './pengeluaran.js';
import dashboardRoutes from './dashboard.js';
import iuranRoutes from './iuran.js';
import laporanRoutes from './laporan.js';
import saldoAwalRoutes from './saldoAwal.js';
import usersRoutes from './users.js';
import kategoriRoutes from './kategori.js';

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
