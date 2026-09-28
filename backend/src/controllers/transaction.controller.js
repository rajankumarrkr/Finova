import { Transaction } from '../models/Transaction.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getTransactions = async (req, res, next) => {
  try {
    const { category, type, search, status, page = 1, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (category) {
      const catMap = {
        Investments: 'investment',
        Earnings: 'daily_earning',
        Withdrawals: 'withdrawal',
        Referrals: 'referral_bonus'
      };
      query.type = catMap[category] || category.toLowerCase();
    } else if (type) {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    return ApiResponse.success(res, 'Transactions retrieved', {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
