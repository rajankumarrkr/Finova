import { InvestmentService } from '../services/investment.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createInvestment = async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return ApiResponse.error(res, 'Plan ID is required', 'MISSING_PLAN_ID', 400);
    }

    const investment = await InvestmentService.createInvestment(req.user._id, planId);
    return ApiResponse.success(res, 'Investment plan activated successfully', investment, 201);
  } catch (error) {
    next(error);
  }
};

export const getInvestments = async (req, res, next) => {
  try {
    const investments = await InvestmentService.getUserInvestments(req.user._id);
    return ApiResponse.success(res, 'User investments retrieved', investments);
  } catch (error) {
    next(error);
  }
};

export const getInvestmentById = async (req, res, next) => {
  try {
    const investment = await InvestmentService.getInvestmentById(req.user._id, req.params.id);
    return ApiResponse.success(res, 'Investment details retrieved', investment);
  } catch (error) {
    next(error);
  }
};
