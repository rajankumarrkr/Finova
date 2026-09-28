import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { generateTransactionId } from '../utils/transactionId.js';

export class WalletService {
  /**
   * Credit money to user available balance and log transaction
   */
  static async credit({ userId, amount, type, reference, metadata = {}, session = null }) {
    if (amount <= 0) throw new Error('Credit amount must be greater than zero');

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    // Update balances
    user.wallet.availableBalance += amount;
    if (type === 'daily_earning' || type === 'referral_bonus') {
      user.wallet.totalEarnings += amount;
      if (type === 'referral_bonus') {
        user.wallet.totalReferralEarnings += amount;
      }
    }
    await user.save({ session });

    // Create immutable ledger entry
    const transactionId = generateTransactionId('TXN');
    const transaction = await Transaction.create(
      [
        {
          transactionId,
          user: userId,
          type,
          amount,
          direction: 'credit',
          status: 'completed',
          reference: reference || `Credit ${type}`,
          metadata
        }
      ],
      { session }
    );

    return { user, transaction: transaction[0] };
  }

  /**
   * Debit money from user available balance and log transaction
   */
  static async debit({ userId, amount, type, reference, metadata = {}, session = null }) {
    if (amount <= 0) throw new Error('Debit amount must be greater than zero');

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    if (user.wallet.availableBalance < amount) {
      throw new Error('INSUFFICIENT_BALANCE: Available balance is lower than required amount');
    }

    user.wallet.availableBalance -= amount;
    if (type === 'investment') {
      user.wallet.totalInvested += amount;
    }
    await user.save({ session });

    const transactionId = generateTransactionId('TXN');
    const transaction = await Transaction.create(
      [
        {
          transactionId,
          user: userId,
          type,
          amount,
          direction: 'debit',
          status: 'completed',
          reference: reference || `Debit ${type}`,
          metadata
        }
      ],
      { session }
    );

    return { user, transaction: transaction[0] };
  }

  /**
   * Hold available balance for withdrawal
   */
  static async hold({ userId, amount, session = null }) {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    if (user.wallet.availableBalance < amount) {
      throw new Error('INSUFFICIENT_BALANCE: Insufficient balance for withdrawal hold');
    }

    user.wallet.availableBalance -= amount;
    user.wallet.pendingBalance += amount;
    await user.save({ session });
    return user;
  }

  /**
   * Release hold upon withdrawal failure or rejection
   */
  static async releaseHold({ userId, amount, session = null }) {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    user.wallet.pendingBalance = Math.max(0, user.wallet.pendingBalance - amount);
    user.wallet.availableBalance += amount;
    await user.save({ session });
    return user;
  }
}
