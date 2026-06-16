"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKategoriPemasukan = exports.getKategoriPemasukan = exports.deletePemasukan = exports.updatePemasukan = exports.createPemasukan = exports.getPemasukan = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getPemasukan = async (req, res) => {
    try {
        const pemasukan = await prisma_1.default.pemasukan.findMany({
            include: {
                kategoripemasukan: true,
                warga: true
            },
            orderBy: { tanggal: 'desc' }
        });
        res.json({ success: true, data: pemasukan });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPemasukan = getPemasukan;
const createPemasukan = async (req, res) => {
    try {
        const data = req.body;
        // ensure date is valid Date object
        if (data.tanggal) {
            data.tanggal = new Date(data.tanggal);
        }
        const userId = req.user.id;
        data.createdById = userId;
        if (!data.no_transaksi) {
            data.no_transaksi = `TRX-${Date.now()}`;
        }
        const pemasukan = await prisma_1.default.pemasukan.create({ data });
        res.status(201).json({ success: true, data: pemasukan });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};
exports.createPemasukan = createPemasukan;
const updatePemasukan = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (data.tanggal) {
            data.tanggal = new Date(data.tanggal);
        }
        const pemasukan = await prisma_1.default.pemasukan.update({ where: { id }, data });
        res.json({ success: true, data: pemasukan });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updatePemasukan = updatePemasukan;
const deletePemasukan = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.pemasukan.delete({ where: { id } });
        res.json({ success: true, message: 'Pemasukan deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deletePemasukan = deletePemasukan;
// Kategori Pemasukan
const getKategoriPemasukan = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripemasukan.findMany();
        res.json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getKategoriPemasukan = getKategoriPemasukan;
const createKategoriPemasukan = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripemasukan.create({ data: req.body });
        res.status(201).json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createKategoriPemasukan = createKategoriPemasukan;
