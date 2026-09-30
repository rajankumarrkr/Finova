import { User } from '../models/User.js';
import { Investment } from '../models/Investment.js';
import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Deposit } from '../models/Deposit.js';
import { Transaction } from '../models/Transaction.js';
import { Earning } from '../models/Earning.js';
import { AuditLog } from '../models/AuditLog.js';
import { Setting } from '../models/Setting.js';
import { WithdrawalService } from '../services/withdrawal.service.js';
import { DepositService } from '../services/deposit.service.js';
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
    const updateData = { ...req.body };
    // Recalculate derived fields if relevant fields change
    if (updateData.dailyEarning && updateData.durationDays) {
      updateData.scheduledEarnings = updateData.dailyEarning * updateData.durationDays;
      if (updateData.investmentAmount) {
        updateData.roi = `${Math.round((updateData.scheduledEarnings / updateData.investmentAmount) * 100)}%`;
      }
    }
    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    const plan = await InvestmentPlan.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!plan) return ApiResponse.error(res, 'Plan not found', 'NOT_FOUND', 404);

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_UPDATE_PLAN',
      entity: 'InvestmentPlan',
      entityId: plan._id.toString(),
      metadata: updateData
    });

    return ApiResponse.success(res, 'Investment plan updated successfully', plan);
  } catch (error) {
    next(error);
  }
};

export const getPlans = async (req, res, next) => {
  try {
    const plans = await InvestmentPlan.find().sort({ investmentAmount: 1 }).lean();
    return ApiResponse.success(res, 'All investment plans retrieved', plans);
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) return ApiResponse.error(res, 'Plan not found', 'NOT_FOUND', 404);

    // Check if any active investments reference this plan
    const activeInvestments = await Investment.countDocuments({ plan: req.params.id, status: 'active' });
    if (activeInvestments > 0) {
      return ApiResponse.error(
        res,
        `Cannot delete plan with ${activeInvestments} active investment(s). Deactivate instead.`,
        'PLAN_HAS_ACTIVE_INVESTMENTS',
        400
      );
    }

    await InvestmentPlan.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_DELETE_PLAN',
      entity: 'InvestmentPlan',
      entityId: plan._id.toString(),
      metadata: { name: plan.name, investmentAmount: plan.investmentAmount }
    });

    return ApiResponse.success(res, 'Investment plan deleted successfully', { id: plan._id.toString() });
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

export const getDeposits = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let deposits = await Deposit.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone avatar');

    if (search) {
      const searchLower = search.toLowerCase();
      deposits = deposits.filter((d) => {
        const userName = d.user?.name?.toLowerCase() || '';
        const userEmail = d.user?.email?.toLowerCase() || '';
        const userPhone = d.user?.phone?.toLowerCase() || '';
        const ref = d.paymentReference?.toLowerCase() || '';
        const utr = d.utr?.toLowerCase() || '';
        return (
          userName.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          userPhone.includes(searchLower) ||
          ref.includes(searchLower) ||
          utr.includes(searchLower)
        );
      });
    }

    return ApiResponse.success(res, 'Admin deposit requests retrieved', deposits);
  } catch (error) {
    next(error);
  }
};

export const updateDepositStatus = async (req, res, next) => {
  try {
    const { status, utr } = req.body;
    const { id } = req.params;

    if (status === 'SUCCESS') {
      const result = await DepositService.adminApproveDeposit({ depositId: id, utr });
      return ApiResponse.success(res, 'Deposit approved & credited successfully', result.deposit);
    } else if (status === 'FAILED') {
      const deposit = await Deposit.findByIdAndUpdate(
        id,
        { $set: { status: 'FAILED' } },
        { new: true }
      );
      return ApiResponse.success(res, 'Deposit marked as failed', deposit);
    }

    return ApiResponse.error(res, 'Invalid deposit status action', 'BAD_REQUEST', 400);
  } catch (error) {
    next(error);
  }
};

// ─── Settings Management ────────────────────────────────────────────────────

export const getSettings = async (req, res, next) => {
  try {
    const keys = ['upiId', 'merchantName', 'qrCodeUrl'];
    const settings = await Setting.find({ key: { $in: keys } }).lean();

    const result = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    return ApiResponse.success(res, 'Platform settings retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { key, value } = req.body;

    const allowedKeys = ['upiId', 'merchantName', 'qrCodeUrl'];
    if (!key || !allowedKeys.includes(key)) {
      return ApiResponse.error(res, `Invalid setting key. Allowed: ${allowedKeys.join(', ')}`, 'BAD_REQUEST', 400);
    }

    if (value === undefined || value === null || String(value).trim() === '') {
      return ApiResponse.error(res, 'Setting value cannot be empty', 'BAD_REQUEST', 400);
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { $set: { key, value: String(value).trim() } },
      { upsert: true, new: true }
    );

    await AuditLog.create({
      actor: req.user._id,
      action: 'ADMIN_UPDATE_SETTING',
      entity: 'Setting',
      entityId: setting._id.toString(),
      metadata: { key, value: String(value).trim() },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    return ApiResponse.success(res, `Setting "${key}" updated successfully`, setting);
  } catch (error) {
    next(error);
  }
};
