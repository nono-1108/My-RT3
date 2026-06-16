"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKategoriPengeluaran = exports.getKategoriPengeluaran = exports.deletePengeluaran = exports.updatePengeluaran = exports.createPengeluaran = exports.getPengeluaran = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getPengeluaran = async (req, res) => {
    try {
        const pengeluaran = await prisma_1.default.pengeluaran.findMany({
            include: {
                kategoripengeluaran: true
            },
            orderBy: { tanggal: 'desc' }
        });
        res.json({ success: true, data: pengeluaran });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPengeluaran = getPengeluaran;
const createPengeluaran = async (req, res) => {
    try {
        const data = req.body;
        if (data.tanggal) {
            data.tanggal = new Date(data.tanggal);
        }
        const userId = req.user.id;
        data.createdById = userId;
        if (!data.no_pengeluaran) {
            data.no_pengeluaran = `OUT-${Date.now()}`;
        }
        const pengeluaran = await prisma_1.default.pengeluaran.create({ data });
        res.status(201).json({ success: true, data: pengeluaran });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};
exports.createPengeluaran = createPengeluaran;
const updatePengeluaran = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (data.tanggal) {
            data.tanggal = new Date(data.tanggal);
        }
        const pengeluaran = await prisma_1.default.pengeluaran.update({ where: { id }, data });
        res.json({ success: true, data: pengeluaran });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updatePengeluaran = updatePengeluaran;
const deletePengeluaran = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.pengeluaran.delete({ where: { id } });
        res.json({ success: true, message: 'Pengeluaran deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deletePengeluaran = deletePengeluaran;
// Kategori Pengeluaran
const getKategoriPengeluaran = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripengeluaran.findMany();
        res.json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getKategoriPengeluaran = getKategoriPengeluaran;
const createKategoriPengeluaran = async (req, res) => {
    try {
        const kategori = await prisma_1.default.kategoripengeluaran.create({ data: req.body });
        res.status(201).json({ success: true, data: kategori });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createKategoriPengeluaran = createKategoriPengeluaran;
