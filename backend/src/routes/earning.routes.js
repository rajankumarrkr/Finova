import express from 'express';
import { getEarnings, getEarningsSummary } from '../controllers/earning.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getEarnings);
router.get('/summary', getEarningsSummary);

export default router;
