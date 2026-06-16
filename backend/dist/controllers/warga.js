"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWarga = exports.updateWarga = exports.createWarga = exports.getWargaById = exports.getWarga = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getWarga = async (req, res) => {
    try {
        const warga = await prisma_1.default.warga.findMany();
        res.json({ success: true, data: warga });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getWarga = getWarga;
const getWargaById = async (req, res) => {
    try {
        const id = req.params.id;
        const warga = await prisma_1.default.warga.findUnique({ where: { id } });
        if (!warga)
            return res.status(404).json({ success: false, message: 'Warga not found' });
        res.json({ success: true, data: warga });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getWargaById = getWargaById;
const createWarga = async (req, res) => {
    try {
        const data = req.body;
        const warga = await prisma_1.default.warga.create({ data });
        res.status(201).json({ success: true, data: warga });
    }
    catch (error) {
        console.error('Error creating warga:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error', error });
    }
};
exports.createWarga = createWarga;
const updateWarga = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const warga = await prisma_1.default.warga.update({ where: { id }, data });
        res.json({ success: true, data: warga });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateWarga = updateWarga;
const deleteWarga = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.warga.delete({ where: { id } });
        res.json({ success: true, message: 'Warga deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteWarga = deleteWarga;
