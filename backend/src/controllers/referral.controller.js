import { ReferralService } from '../services/referral.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getReferralStats = async (req, res, next) => {
  try {
    const stats = await ReferralService.getReferralStats(req.user._id);
    return ApiResponse.success(res, 'Referral statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getReferralHistory = async (req, res, next) => {
  try {
    const history = await ReferralService.getReferralHistory(req.user._id);
    return ApiResponse.success(res, 'Referral reward history retrieved', history);
  } catch (error) {
    next(error);
  }
};
