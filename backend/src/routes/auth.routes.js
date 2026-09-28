import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    referralCode: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(1, 'Password is required')
  })
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
