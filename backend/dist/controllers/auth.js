"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!user.status) {
            return res.status(403).json({ success: false, message: 'Account is inactive' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
            access_level: user.access_level,
            nama: user.nama
        };
        const secret = process.env.JWT_SECRET || 'secret';
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1d' });
        res.json({
            success: true,
            data: {
                token,
                user: payload
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, nama: true, role: true, status: true, createdAt: true }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getMe = getMe;
