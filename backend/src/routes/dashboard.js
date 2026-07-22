import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', getDashboardStats);

export default router;
