import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await InvestmentPlan.find({ status: 'active' }).sort({ investmentAmount: 1 });
    return ApiResponse.success(res, 'Active investment plans retrieved', plans);
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return ApiResponse.error(res, 'Investment plan not found', 'NOT_FOUND', 404);
    }
    return ApiResponse.success(res, 'Plan details retrieved', plan);
  } catch (error) {
    next(error);
  }
};
