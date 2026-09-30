import { DepositService } from '../services/deposit.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * POST /api/deposits/create
 */
export const createDeposit = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { amount } = req.body;

    const result = await DepositService.createDeposit({ userId, amount });
    return res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      return ApiResponse.error(res, error.message, error.code || 'BAD_REQUEST', error.statusCode);
    }
    next(error);
  }
};

/**
 * GET /api/deposits/:id
 */
export const getDepositById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const result = await DepositService.getDepositById({ userId, depositId: id });
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return ApiResponse.error(res, error.message, error.code || 'BAD_REQUEST', error.statusCode);
    }
    next(error);
  }
};

/**
 * POST /api/deposits/:id/verify
 */
export const verifyDeposit = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { utr, screenshot, paymentScreenshot, autoApprove } = req.body;

    const result = await DepositService.verifyDeposit({
      userId,
      depositId: id,
      utr,
      screenshot: screenshot || paymentScreenshot,
      autoApprove: Boolean(autoApprove),
      req
    });

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return ApiResponse.error(res, error.message, error.code || 'BAD_REQUEST', error.statusCode);
    }
    next(error);
  }
};

/**
 * GET /api/deposits/history
 */
export const getDepositHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page, limit } = req.query;

    const result = await DepositService.getDepositHistory({ userId, page, limit });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/deposits/:id/admin-approve
 */
export const adminApproveDeposit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { utr } = req.body;

    const result = await DepositService.adminApproveDeposit({ depositId: id, utr });
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return ApiResponse.error(res, error.message, error.code || 'BAD_REQUEST', error.statusCode);
    }
    next(error);
  }
};
