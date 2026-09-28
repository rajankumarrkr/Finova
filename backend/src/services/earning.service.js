import { Earning } from '../models/Earning.js';
import { User } from '../models/User.js';

export class EarningService {
  static async getUserEarnings(userId) {
    return await Earning.find({ user: userId }).sort({ createdAt: -1 }).populate('investment', 'planName amount');
  }

  static async getEarningsSummary(userId) {
    const user = await User.findById(userId);
    if (!user) throw { statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' };

    const todayStr = new Date().toISOString().substring(0, 10);
    const todayEarningsDocs = await Earning.find({
      user: userId,
      earningDate: todayStr,
      status: 'credited'
    });

    const todayTotal = todayEarningsDocs.reduce((sum, item) => sum + item.amount, 0);

    return {
      today: todayTotal,
      total: user.wallet.totalEarnings,
      referral: user.wallet.totalReferralEarnings
    };
  }
}
