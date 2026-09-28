import { WithdrawalService } from '../services/withdrawal.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, bankAccountId } = req.body;
    const withdrawal = await WithdrawalService.requestWithdrawal(req.user._id, amount, bankAccountId);
    return ApiResponse.success(res, 'Withdrawal request submitted successfully', withdrawal, 201);
  } catch (error) {
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await WithdrawalService.getUserWithdrawals(req.user._id);
    return ApiResponse.success(res, 'Withdrawal requests retrieved', withdrawals);
  } catch (error) {
    next(error);
  }
};
