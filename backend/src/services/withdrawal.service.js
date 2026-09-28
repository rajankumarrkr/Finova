import { Withdrawal } from '../models/Withdrawal.js';
import { BankAccount } from '../models/BankAccount.js';
import { WalletService } from './wallet.service.js';
import { Notification } from '../models/Notification.js';
import { generateTransactionId } from '../utils/transactionId.js';
import { Transaction } from '../models/Transaction.js';

export class WithdrawalService {
  static async requestWithdrawal(userId, amount, bankAccountId) {
    if (!amount || amount < 100) {
      throw { statusCode: 400, message: 'Minimum withdrawal amount is ₹100', code: 'MIN_WITHDRAWAL_LIMIT' };
    }

    const bankAccount = await BankAccount.findOne({ _id: bankAccountId, user: userId });
    if (!bankAccount) {
      throw { statusCode: 404, message: 'Verified bank account not found', code: 'BANK_NOT_FOUND' };
    }

    // Place hold on wallet available balance
    await WalletService.hold({ userId, amount });

    // Create pending transaction record
    const transactionId = generateTransactionId('TXN');
    const transaction = await Transaction.create({
      transactionId,
      user: userId,
      type: 'withdrawal',
      amount,
      direction: 'debit',
      status: 'Processing',
      reference: `Withdrawal to ${bankAccount.bankName} (${bankAccount.accountNumberLast4})`
    });

    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      bankAccount: bankAccountId,
      status: 'pending',
      transaction: transaction._id
    });

    // Notify User
    await Notification.create({
      user: userId,
      title: 'Withdrawal Requested',
      message: `₹${amount.toLocaleString()} withdrawal request to ${bankAccount.bankName} is under processing.`,
      type: 'arrow-down',
      category: 'Withdrawal'
    });

    return withdrawal;
  }

  static async getUserWithdrawals(userId) {
    return await Withdrawal.find({ user: userId }).sort({ createdAt: -1 }).populate('bankAccount');
  }

  static async updateWithdrawalStatus(withdrawalId, status, adminNote = '') {
    const withdrawal = await Withdrawal.findById(withdrawalId).populate('transaction');
    if (!withdrawal) {
      throw { statusCode: 404, message: 'Withdrawal request not found', code: 'NOT_FOUND' };
    }

    if (withdrawal.status === 'completed' || withdrawal.status === 'rejected') {
      throw { statusCode: 400, message: `Withdrawal is already ${withdrawal.status}`, code: 'ALREADY_PROCESSED' };
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = new Date();

    if (status === 'completed') {
      if (withdrawal.transaction) {
        withdrawal.transaction.status = 'completed';
        await withdrawal.transaction.save();
      }
      // Deduct from pendingBalance permanently
      const user = await WalletService.releaseHold({ userId: withdrawal.user, amount: 0 }); // release hold logic handled by clearing pending
      user.wallet.pendingBalance = Math.max(0, user.wallet.pendingBalance - withdrawal.amount);
      await user.save();

      await Notification.create({
        user: withdrawal.user,
        title: 'Withdrawal Completed',
        message: `₹${withdrawal.amount.toLocaleString()} payout processed successfully via IMPS.`,
        type: 'check',
        category: 'Withdrawal'
      });
    } else if (status === 'rejected' || status === 'cancelled') {
      if (withdrawal.transaction) {
        withdrawal.transaction.status = 'failed';
        await withdrawal.transaction.save();
      }
      // Release held amount back to available balance
      await WalletService.releaseHold({ userId: withdrawal.user, amount: withdrawal.amount });

      await Notification.create({
        user: withdrawal.user,
        title: 'Withdrawal Rejected',
        message: `₹${withdrawal.amount.toLocaleString()} withdrawal was rejected. Funds returned to your available balance.`,
        type: 'arrow-down',
        category: 'Withdrawal'
      });
    }

    await withdrawal.save();
    return withdrawal;
  }
}
