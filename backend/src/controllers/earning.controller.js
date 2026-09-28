import { EarningService } from '../services/earning.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getEarnings = async (req, res, next) => {
  try {
    const earnings = await EarningService.getUserEarnings(req.user._id);
    return ApiResponse.success(res, 'Earnings history retrieved', earnings);
  } catch (error) {
    next(error);
  }
};

export const getEarningsSummary = async (req, res, next) => {
  try {
    const summary = await EarningService.getEarningsSummary(req.user._id);
    return ApiResponse.success(res, 'Earnings summary retrieved', summary);
  } catch (error) {
    next(error);
  }
};
