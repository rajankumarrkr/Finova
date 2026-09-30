import mongoose from 'mongoose';
import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { Investment } from '../models/Investment.js';
import { User } from '../models/User.js';
import { WalletService } from './wallet.service.js';
import { ReferralService } from './referral.service.js';

export class InvestmentService {
  static async createInvestment(userId, planId) {
    const plan = await InvestmentPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      throw { statusCode: 404, message: 'Investment plan not found or inactive', code: 'PLAN_NOT_FOUND' };
    }

    const user = await User.findById(userId);
    if (!user) throw { statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' };

    // Verify balance
    if (user.wallet.availableBalance < plan.investmentAmount) {
      throw {
        statusCode: 400,
        message: `Insufficient available balance! Required ${plan.investmentAmount}, available ${user.wallet.availableBalance}`,
        code: 'INSUFFICIENT_BALANCE'
      };
    }

    // Debit wallet ledger
    const { transaction } = await WalletService.debit({
      userId,
      amount: plan.investmentAmount,
      type: 'investment',
      reference: `Investment — ${plan.name}`,
      metadata: { planId: plan._id.toString() }
    });

    // Create Investment record
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const nextEarningAt = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const investment = await Investment.create({
      user: userId,
      plan: plan._id,
      planName: plan.name,
      badge: plan.badge,
      color: plan.color,
      amount: plan.investmentAmount,
      dailyEarning: plan.dailyEarning,
      durationDays: plan.durationDays,
      completedDays: 1, // Day 1 initial return scheduled
      totalEarned: 0,
      startDate,
      endDate,
      nextEarningAt,
      status: 'active'
    });

    // Process referral reward if user has referrer
    if (user.referredBy) {
      try {
        await ReferralService.processReferralBonus({
          referrerId: user.referredBy,
          referredUserId: user._id,
          eligibleAmount: plan.investmentAmount,
          sourceTransactionId: transaction._id
        });
      } catch (err) {
        console.error('[Referral Bonus Processing Error]:', err.message);
      }
    }

    return investment;
  }

  static async getUserInvestments(userId) {
    return await Investment.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getInvestmentById(userId, id) {
    const investment = await Investment.findOne({ _id: id, user: userId });
    if (!investment) {
      throw { statusCode: 404, message: 'Investment record not found', code: 'NOT_FOUND' };
    }
    return investment;
  }
}
