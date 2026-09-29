import express from 'express';
import {
  getAdminDashboard,
  getUsers,
  updateUserStatus,
  createPlan,
  updatePlan,
  getPlans,
  deletePlan,
  getWithdrawals,
  updateWithdrawalStatus,
  getDeposits,
  updateDepositStatus,
  getSettings,
  updateSettings
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

router.get('/plans', getPlans);
router.post('/plans', createPlan);
router.patch('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

router.get('/deposits', getDeposits);
router.patch('/deposits/:id/status', updateDepositStatus);

router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id/status', updateWithdrawalStatus);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;

