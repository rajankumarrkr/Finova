import express from 'express';
import { requestWithdrawal, getWithdrawals } from '../controllers/withdrawal.controller.js';
import { protect } from '../middleware/auth.js';
import { financialLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const withdrawalSchema = z.object({
  body: z.object({
    amount: z.number().min(100, 'Minimum withdrawal amount is ₹100'),
    bankAccountId: z.string().min(1, 'bankAccountId is required')
  })
});

router.use(protect);

router.post('/', financialLimiter, validate(withdrawalSchema), requestWithdrawal);
router.get('/', getWithdrawals);

export default router;
