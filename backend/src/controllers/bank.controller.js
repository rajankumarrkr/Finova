import { BankAccount } from '../models/BankAccount.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { encrypt } from '../utils/encryption.js';

export const getBankAccounts = async (req, res, next) => {
  try {
    const accounts = await BankAccount.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });

    const maskedAccounts = accounts.map(acc => ({
      id: acc._id,
      accountHolderName: acc.accountHolderName,
      bankName: acc.bankName,
      accountNumber: `XXXX XXXX ${acc.accountNumberLast4}`,
      ifsc: acc.ifsc,
      isVerified: acc.isVerified,
      isPrimary: acc.isPrimary,
      createdAt: acc.createdAt
    }));

    return ApiResponse.success(res, 'Bank accounts retrieved', maskedAccounts);
  } catch (error) {
    next(error);
  }
};

export const addBankAccount = async (req, res, next) => {
  try {
    const { accountHolderName, bankName, accountNumber, ifsc } = req.body;

    if (!accountNumber || accountNumber.length < 9) {
      return ApiResponse.error(res, 'Enter a valid account number (min 9 digits)', 'INVALID_ACCOUNT_NUMBER', 400);
    }

    const encrypted = encrypt(accountNumber);

    const last4 = accountNumber.slice(-4);
    const existingCount = await BankAccount.countDocuments({ user: req.user._id });

    const bankAccount = await BankAccount.create({
      user: req.user._id,
      accountHolderName,
      bankName,
      accountNumberEncrypted: encrypted,
      accountNumberLast4: last4,
      ifsc: ifsc.toUpperCase(),
      isVerified: true,
      isPrimary: existingCount === 0
    });

    return ApiResponse.success(res, 'Bank account linked successfully', {
      id: bankAccount._id,
      accountHolderName: bankAccount.accountHolderName,
      bankName: bankAccount.bankName,
      accountNumber: `XXXX XXXX ${last4}`,
      ifsc: bankAccount.ifsc,
      isVerified: bankAccount.isVerified,
      isPrimary: bankAccount.isPrimary
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteBankAccount = async (req, res, next) => {
  try {
    const account = await BankAccount.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!account) {
      return ApiResponse.error(res, 'Bank account not found', 'NOT_FOUND', 404);
    }
    return ApiResponse.success(res, 'Bank account unlinked successfully');
  } catch (error) {
    next(error);
  }
};
