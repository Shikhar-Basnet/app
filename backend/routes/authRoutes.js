import express from 'express';
import { register, login, checkAuth, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', checkAuth);
router.get('/logout', logout);

export default router;
