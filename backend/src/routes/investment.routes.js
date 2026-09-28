import express from 'express';
import { createInvestment, getInvestments, getInvestmentById } from '../controllers/investment.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const investmentSchema = z.object({
  body: z.object({
    planId: z.string().min(1, 'planId is required')
  })
});

router.use(protect);

router.post('/', validate(investmentSchema), createInvestment);
router.get('/', getInvestments);
router.get('/:id', getInvestmentById);

export default router;
