"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                access_level: true,
                status: true
            },
            orderBy: { role: 'asc' }
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, password, role, access_level } = req.body;
        const updateData = {};
        if (nama)
            updateData.nama = nama;
        if (role)
            updateData.role = role;
        if (access_level)
            updateData.access_level = access_level;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                nama: true,
                role: true,
                access_level: true,
                status: true
            }
        });
        res.json({ success: true, data: updatedUser, message: 'User berhasil diupdate' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
