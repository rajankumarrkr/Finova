import express from 'express';
import { getPlans, getPlanById } from '../controllers/plan.controller.js';

const router = express.Router();

router.get('/', getPlans);
router.get('/:id', getPlanById);

export default router;
