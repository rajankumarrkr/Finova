import express from 'express';
import {
  getAdminDashboard,
  getUsers,
  updateUserStatus,
  createPlan,
  updatePlan,
  getWithdrawals,
  updateWithdrawalStatus
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

router.post('/plans', createPlan);
router.patch('/plans/:id', updatePlan);

router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/status', updateWithdrawalStatus);

export default router;
