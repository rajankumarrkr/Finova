import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import {
  createDeposit,
  getDepositById,
  verifyDeposit,
  getDepositHistory,
  adminApproveDeposit
} from '../controllers/deposit.controller.js';

const router = express.Router();

// User authenticated routes
router.post('/create', protect, createDeposit);
router.post('/create-order', protect, createDeposit);
router.get('/history', protect, getDepositHistory);
router.get('/:id', protect, getDepositById);
router.post('/:id/verify', protect, verifyDeposit);

// Admin or test approval route
router.post('/:id/admin-approve', protect, adminApproveDeposit);

export default router;
