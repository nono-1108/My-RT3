"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKategoriPengeluaran = exports.updateKategoriPengeluaran = exports.createKategoriPengeluaran = exports.getKategoriPengeluaran = exports.deleteKategoriPemasukan = exports.updateKategoriPemasukan = exports.createKategoriPemasukan = exports.getKategoriPemasukan = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Kategori Pemasukan
const getKategoriPemasukan = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripemasukan.findMany({
            orderBy: { nama: 'asc' }
        });
        res.json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getKategoriPemasukan = getKategoriPemasukan;
const createKategoriPemasukan = async (req, res) => {
    try {
        const { nama, deskripsi } = req.body;
        const kategori = await prisma_1.default.kategoripemasukan.create({
            data: { nama, deskripsi }
        });
        res.status(201).json({ success: true, data: kategori, message: 'Kategori berhasil ditambahkan' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createKategoriPemasukan = createKategoriPemasukan;
const updateKategoriPemasukan = async (req, res) => {
    try {
        const id = req.params.id;
        const { nama, deskripsi } = req.body;
        const kategori = await prisma_1.default.kategoripemasukan.update({
            where: { id },
            data: { nama, deskripsi }
        });
        res.json({ success: true, data: kategori, message: 'Kategori berhasil diperbarui' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateKategoriPemasukan = updateKategoriPemasukan;
const deleteKategoriPemasukan = async (req, res) => {
    try {
        const id = req.params.id;
        // Check if it's used
        const count = await prisma_1.default.pemasukan.count({ where: { kategoriId: id } });
        if (count > 0) {
            return res.status(400).json({ success: false, message: 'Kategori tidak dapat dihapus karena sedang digunakan.' });
        }
        await prisma_1.default.kategoripemasukan.delete({ where: { id } });
        res.json({ success: true, message: 'Kategori berhasil dihapus' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteKategoriPemasukan = deleteKategoriPemasukan;
// Kategori Pengeluaran
const getKategoriPengeluaran = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripengeluaran.findMany({
            orderBy: { nama: 'asc' }
        });
        res.json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getKategoriPengeluaran = getKategoriPengeluaran;
const createKategoriPengeluaran = async (req, res) => {
    try {
        const { nama, deskripsi } = req.body;
        const kategori = await prisma_1.default.kategoripengeluaran.create({
            data: { nama, deskripsi }
        });
        res.status(201).json({ success: true, data: kategori, message: 'Kategori berhasil ditambahkan' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createKategoriPengeluaran = createKategoriPengeluaran;
const updateKategoriPengeluaran = async (req, res) => {
    try {
        const id = req.params.id;
        const { nama, deskripsi } = req.body;
        const kategori = await prisma_1.default.kategoripengeluaran.update({
            where: { id },
            data: { nama, deskripsi }
        });
        res.json({ success: true, data: kategori, message: 'Kategori berhasil diperbarui' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateKategoriPengeluaran = updateKategoriPengeluaran;
const deleteKategoriPengeluaran = async (req, res) => {
    try {
        const id = req.params.id;
        // Check if it's used
        const count = await prisma_1.default.pengeluaran.count({ where: { kategoriId: id } });
        if (count > 0) {
            return res.status(400).json({ success: false, message: 'Kategori tidak dapat dihapus karena sedang digunakan.' });
        }
        await prisma_1.default.kategoripengeluaran.delete({ where: { id } });
        res.json({ success: true, message: 'Kategori berhasil dihapus' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteKategoriPengeluaran = deleteKategoriPengeluaran;
