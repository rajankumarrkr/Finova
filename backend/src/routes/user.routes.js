import express from 'express';
import { getDashboard, getPerformance, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboard);
router.get('/dashboard', getDashboard);
router.get('/performance', getPerformance);
router.get('/dashboard/performance', getPerformance);
router.patch('/profile', updateProfile);

export default router;
