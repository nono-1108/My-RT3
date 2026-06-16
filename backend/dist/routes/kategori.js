"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kategori_1 = require("../controllers/kategori");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Kategori Pemasukan
router.get('/pemasukan', kategori_1.getKategoriPemasukan);
router.post('/pemasukan', kategori_1.createKategoriPemasukan);
router.put('/pemasukan/:id', kategori_1.updateKategoriPemasukan);
router.delete('/pemasukan/:id', kategori_1.deleteKategoriPemasukan);
// Kategori Pengeluaran
router.get('/pengeluaran', kategori_1.getKategoriPengeluaran);
router.post('/pengeluaran', kategori_1.createKategoriPengeluaran);
router.put('/pengeluaran/:id', kategori_1.updateKategoriPengeluaran);
router.delete('/pengeluaran/:id', kategori_1.deleteKategoriPengeluaran);
exports.default = router;
