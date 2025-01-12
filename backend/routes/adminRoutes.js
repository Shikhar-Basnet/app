import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', verifyRole('admin'), getAdminStats);

export default router;
