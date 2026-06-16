"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saldoAwal_1 = require("../controllers/saldoAwal");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', saldoAwal_1.getSaldoAwal);
router.post('/', (0, auth_1.authorize)(['ADMIN']), saldoAwal_1.createSaldoAwal);
router.put('/:id', (0, auth_1.authorize)(['ADMIN']), saldoAwal_1.updateSaldoAwal);
router.delete('/:id', (0, auth_1.authorize)(['ADMIN']), saldoAwal_1.deleteSaldoAwal);
exports.default = router;
