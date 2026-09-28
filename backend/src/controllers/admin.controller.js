import { User } from '../models/User.js';
import { Investment } from '../models/Investment.js';
import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Transaction } from '../models/Transaction.js';
import { Earning } from '../models/Earning.js';
import { AuditLog } from '../models/AuditLog.js';
import { WithdrawalService } from '../services/withdrawal.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });

    const totalDepositsDoc = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDeposits = totalDepositsDoc[0]?.total || 0;

    const totalInvestmentsDoc = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalInvestments = totalInvestmentsDoc[0]?.total || 0;

    const totalWithdrawalsDoc = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = totalWithdrawalsDoc[0]?.total || 0;

    const pendingWithdrawalsCount = await Withdrawal.countDocuments({ status: 'pending' });

    const totalEarningsDoc = await Earning.aggregate([
      { $match: { status: 'credited' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalEarnings = totalEarningsDoc[0]?.total || 0;

    return ApiResponse.success(res, 'Admin system metrics retrieved', {
      totalUsers,
      activeUsers,
      totalDeposits,
      totalInvestments,
      totalWithdrawals,
      pendingWithdrawals: pendingWithdrawalsCount,
      totalEarnings
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = { role: 'user' };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);

    return ApiResponse.success(res, 'User directory retrieved', { users, total });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.error(res, 'User not found', 'NOT_FOUND', 404);

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_UPDATE_USER_STATUS',
      entity: 'User',
      entityId: user._id.toString(),
      metadata: { oldStatus, newStatus: status },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    return ApiResponse.success(res, `User status updated to ${status}`, user);
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const { name, investmentAmount, dailyEarning, durationDays, badge, popular, color, features, description } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const scheduledEarnings = dailyEarning * durationDays;
    const roi = `${Math.round((scheduledEarnings / investmentAmount) * 100)}%`;

    const plan = await InvestmentPlan.create({
      name,
      slug,
      investmentAmount,
      dailyEarning,
      durationDays,
      scheduledEarnings,
      roi,
      badge: badge || 'STARTER',
      popular: popular || false,
      color: color || 'emerald',
      features: features || [],
      description
    });

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_CREATE_PLAN',
      entity: 'InvestmentPlan',
      entityId: plan._id.toString(),
      metadata: { name, investmentAmount }
    });

    return ApiResponse.success(res, 'Investment plan created successfully', plan, 201);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return ApiResponse.error(res, 'Plan not found', 'NOT_FOUND', 404);

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_UPDATE_PLAN',
      entity: 'InvestmentPlan',
      entityId: plan._id.toString()
    });

    return ApiResponse.success(res, 'Investment plan updated successfully', plan);
  } catch (error) {
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('bankAccount');

    return ApiResponse.success(res, 'Admin withdrawal requests retrieved', withdrawals);
  } catch (error) {
    next(error);
  }
};

export const updateWithdrawalStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const withdrawal = await WithdrawalService.updateWithdrawalStatus(req.params.id, status, adminNote);

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_UPDATE_WITHDRAWAL_STATUS',
      entity: 'Withdrawal',
      entityId: withdrawal._id.toString(),
      metadata: { status, adminNote }
    });

    return ApiResponse.success(res, `Withdrawal status updated to ${status}`, withdrawal);
  } catch (error) {
    next(error);
  }
};
