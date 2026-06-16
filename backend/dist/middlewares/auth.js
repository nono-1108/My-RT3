"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
