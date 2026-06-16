"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaldoAwal = exports.updateSaldoAwal = exports.createSaldoAwal = exports.getSaldoAwal = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSaldoAwal = async (req, res) => {
    try {
        const saldoAwal = await prisma_1.default.saldoawal.findMany({
            orderBy: { tanggal_input: 'desc' }
        });
        res.json({ success: true, data: saldoAwal });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getSaldoAwal = getSaldoAwal;
const createSaldoAwal = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user?.id;
        data.createdById = userId;
        const saldoAwal = await prisma_1.default.saldoawal.create({ data });
        res.status(201).json({ success: true, data: saldoAwal });
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: 'Saldo awal untuk periode ini sudah ada.' });
        }
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};
exports.createSaldoAwal = createSaldoAwal;
const updateSaldoAwal = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const saldoAwal = await prisma_1.default.saldoawal.update({ where: { id }, data });
        res.json({ success: true, data: saldoAwal });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateSaldoAwal = updateSaldoAwal;
const deleteSaldoAwal = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.saldoawal.delete({ where: { id } });
        res.json({ success: true, message: 'Saldo awal deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteSaldoAwal = deleteSaldoAwal;
