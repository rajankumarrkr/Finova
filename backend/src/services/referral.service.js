import { Referral } from '../models/Referral.js';
import { User } from '../models/User.js';
import { WalletService } from './wallet.service.js';
import { Notification } from '../models/Notification.js';

export class ReferralService {
  static async processReferralBonus({ referrerId, referredUserId, eligibleAmount, sourceTransactionId }) {
    if (referrerId.toString() === referredUserId.toString()) {
      console.warn('[Referral Warning]: Self-referral ignored');
      return null;
    }

    const rewardRate = 0.10; // 10%
    const rewardAmount = Math.round(eligibleAmount * rewardRate);

    if (rewardAmount <= 0) return null;

    const referredUser = await User.findById(referredUserId);

    // Credit referrer wallet
    const { transaction } = await WalletService.credit({
      userId: referrerId,
      amount: rewardAmount,
      type: 'referral_bonus',
      reference: `Referral Bonus — ${referredUser?.name || 'Team Member'}`,
      metadata: { referredUserId: referredUserId.toString() }
    });

    const referralDoc = await Referral.create({
      referrer: referrerId,
      referredUser: referredUserId,
      eligibleAmount,
      rewardRate,
      rewardAmount,
      sourceTransaction: sourceTransactionId,
      status: 'credited'
    });

    // Notify referrer
    await Notification.create({
      user: referrerId,
      title: 'Referral Reward Credited',
      message: `You received +₹${rewardAmount.toLocaleString()} (10% bonus) for ${referredUser?.name || 'team member'}'s deposit.`,
      type: 'users',
      category: 'Referral'
    });

    return referralDoc;
  }

  static async getReferralStats(userId) {
    const user = await User.findById(userId);
    if (!user) throw { statusCode: 404, message: 'User not found' };

    const directMembers = await User.find({ referredBy: userId });
    const totalTeam = directMembers.length;
    const activeTeam = directMembers.filter(m => m.wallet.totalInvested > 0).length;
    const inactiveTeam = totalTeam - activeTeam;

    return {
      referralCode: user.referralCode,
      referralRewardPercentage: '10%',
      totalTeam,
      activeTeam,
      inactiveTeam,
      totalReferralEarnings: user.wallet.totalReferralEarnings
    };
  }

  static async getReferralHistory(userId) {
    return await Referral.find({ referrer: userId })
      .sort({ createdAt: -1 })
      .populate('referredUser', 'name email avatar phone wallet createdAt');
  }
}
