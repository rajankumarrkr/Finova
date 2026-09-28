import express from 'express';
import { createOrder, verifyPayment, webhook } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';
import { financialLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const orderSchema = z.object({
  body: z.object({
    amount: z.number().min(100, 'Minimum deposit amount is ₹100')
  })
});

const verifySchema = z.object({
  body: z.object({
    providerOrderId: z.string().min(1, 'providerOrderId is required'),
    providerPaymentId: z.string().optional(),
    signature: z.string().optional()
  })
});

// Webhook endpoint (Public signature verified by service)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.use(protect);
router.post('/create-order', financialLimiter, validate(orderSchema), createOrder);
router.post('/verify', financialLimiter, validate(verifySchema), verifyPayment);

export default router;
