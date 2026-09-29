import express from 'express';
import {
  getDashboard,
  getPerformance,
  updateProfile,
  uploadAvatar,
  deleteAvatar
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatarMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboard);
router.get('/dashboard', getDashboard);
router.get('/performance', getPerformance);
router.get('/dashboard/performance', getPerformance);
router.patch('/profile', updateProfile);

// Avatar management routes
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);
router.delete('/avatar', deleteAvatar);

export default router;
