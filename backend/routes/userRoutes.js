import express from 'express';
import { getUserDashboard } from '../controllers/userController.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyRole('user'), getUserDashboard);

export default router;
