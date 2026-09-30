import crypto from 'crypto';
import QRCode from 'qrcode';
import mongoose from 'mongoose';
import { Deposit } from '../models/Deposit.js';
import { Setting } from '../models/Setting.js';
import { WalletService } from './wallet.service.js';
import { CloudinaryService } from './cloudinary.service.js';
import { env } from '../config/env.js';

export class DepositService {
  /**
   * Helper to fetch a setting from the DB, with env fallback.
   */
  static async _getSetting(key, envFallback) {
    try {
      const setting = await Setting.findOne({ key }).lean();
      if (setting && setting.value) return setting.value;
    } catch (e) {
      console.warn(`Failed to read setting "${key}" from DB, using env fallback.`);
    }
    return envFallback;
  }

  /**
   * Create a new deposit order with dynamic UPI URI and QR Code.
   */
  static async createDeposit({ userId, amount }) {
    // 1. Strict Amount Validation
    const parsedAmount = Number(amount);

    if (
      amount === null ||
      amount === undefined ||
      typeof amount === 'boolean' ||
      isNaN(parsedAmount) ||
      !isFinite(parsedAmount)
    ) {
      const err = new Error('Deposit amount must be a valid number');
      err.statusCode = 400;
      err.code = 'INVALID_AMOUNT';
      throw err;
    }

    if (parsedAmount <= 0) {
      const err = new Error('Deposit amount must be greater than zero');
      err.statusCode = 400;
      err.code = 'INVALID_AMOUNT';
      throw err;
    }

    if (parsedAmount < 100) {
      const err = new Error('Minimum deposit amount is ₹100');
      err.statusCode = 400;
      err.code = 'AMOUNT_BELOW_MINIMUM';
      throw err;
    }

    if (parsedAmount > 500000) {
      const err = new Error('Maximum deposit amount is ₹500,000');
      err.statusCode = 400;
      err.code = 'AMOUNT_EXCEEDS_MAXIMUM';
      throw err;
    }

    // Round to 2 decimal places to prevent float precision issues
    const finalAmount = Math.round(parsedAmount * 100) / 100;
    const amountFormatted = finalAmount.toFixed(2);

    // 2. Generate Unique Payment Reference
    const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
    const paymentReference = `FINOVA-DEP-${Date.now().toString(36).toUpperCase()}${randomBytes}`;

    // 3. Fetch UPI ID & Merchant Name from DB Settings, fall back to env
    const upiId = await this._getSetting('upiId', env.FINOVA_UPI_ID || 'finova@upi');
    const merchantName = await this._getSetting('merchantName', env.FINOVA_MERCHANT_NAME || 'FINOVA');

    // 4. Construct Dynamic UPI URI
    // upi://pay?pa=RECEIVING_UPI_ID&pn=MERCHANT_NAME&am=EXACT_AMOUNT&cu=INR&tr=PAYMENT_REFERENCE
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amountFormatted}&cu=INR&tr=${encodeURIComponent(paymentReference)}`;

    // 5. Generate High-Contrast QR Code Base64 DataURL
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(upiUri, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 360,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (qrErr) {
      console.error('Failed to generate QR Code DataURL:', qrErr);
    }

    // 6. Save Deposit Record
    const deposit = await Deposit.create({
      user: userId,
      amount: finalAmount,
      currency: 'INR',
      upiId,
      upiUri,
      paymentReference,
      status: 'PENDING',
      qrCode: qrCodeDataUrl
    });

    return {
      success: true,
      deposit: {
        id: deposit._id.toString(),
        amount: deposit.amount,
        currency: deposit.currency,
        status: deposit.status,
        upiId: deposit.upiId,
        upiUri: deposit.upiUri,
        qrCode: deposit.qrCode,
        paymentReference: deposit.paymentReference,
        createdAt: deposit.createdAt
      }
    };
  }

  /**
   * Get deposit details by ID or payment reference.
   */
  static async getDepositById({ userId, depositId }) {
    let query = { user: userId };

    if (mongoose.Types.ObjectId.isValid(depositId)) {
      query._id = depositId;
    } else {
      query.paymentReference = depositId;
    }

    const deposit = await Deposit.findOne(query);
    if (!deposit) {
      const err = new Error('Deposit request not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    return {
      success: true,
      deposit: {
        id: deposit._id.toString(),
        amount: deposit.amount,
        currency: deposit.currency,
        status: deposit.status,
        upiId: deposit.upiId,
        upiUri: deposit.upiUri,
        qrCode: deposit.qrCode,
        paymentReference: deposit.paymentReference,
        utr: deposit.utr,
        paymentScreenshot: deposit.paymentScreenshot,
        createdAt: deposit.createdAt,
        paidAt: deposit.paidAt,
        verifiedAt: deposit.verifiedAt
      }
    };
  }

  /**
   * Submit UTR & Payment Screenshot / request payment verification for deposit.
   */
  static async verifyDeposit({ userId, depositId, utr, screenshot, autoApprove = false, req = null }) {
    let query = { user: userId };
    if (mongoose.Types.ObjectId.isValid(depositId)) {
      query._id = depositId;
    } else {
      query.paymentReference = depositId;
    }

    const deposit = await Deposit.findOne(query);
    if (!deposit) {
      const err = new Error('Deposit request not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    // If already SUCCESS, return existing (Idempotent response)
    if (deposit.status === 'SUCCESS') {
      return {
        success: true,
        message: 'Deposit already verified and credited',
        deposit: {
          id: deposit._id.toString(),
          amount: deposit.amount,
          status: deposit.status,
          paymentReference: deposit.paymentReference,
          utr: deposit.utr,
          paymentScreenshot: deposit.paymentScreenshot,
          verifiedAt: deposit.verifiedAt
        }
      };
    }

    if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(deposit.status)) {
      const err = new Error(`Cannot verify deposit with status ${deposit.status}`);
      err.statusCode = 400;
      err.code = 'INVALID_STATUS';
      throw err;
    }

    // Strict Proof Validation: Both UTR and Payment Screenshot are required
    const cleanedUtr = utr ? String(utr).trim() : (deposit.utr || '');
    const candidateScreenshot = screenshot || deposit.paymentScreenshot;
    const hasScreenshot = Boolean(candidateScreenshot && typeof candidateScreenshot === 'string' && candidateScreenshot.trim().length > 0);

    if (!cleanedUtr && !hasScreenshot) {
      const err = new Error('Both UTR number and payment receipt screenshot are required');
      err.statusCode = 400;
      err.code = 'PROOF_REQUIRED';
      throw err;
    }

    if (!cleanedUtr) {
      const err = new Error('Please enter the 12-digit UPI Ref / UTR number');
      err.statusCode = 400;
      err.code = 'UTR_REQUIRED';
      throw err;
    }

    if (cleanedUtr.length < 6) {
      const err = new Error('Please enter a valid UTR number (at least 6 characters)');
      err.statusCode = 400;
      err.code = 'INVALID_UTR';
      throw err;
    }

    if (!hasScreenshot) {
      const err = new Error('Payment screenshot is required for deposit verification');
      err.statusCode = 400;
      err.code = 'SCREENSHOT_REQUIRED';
      throw err;
    }

    deposit.utr = cleanedUtr;

    if (screenshot) {
      if (typeof screenshot === 'string' && screenshot.startsWith('data:image/')) {
        try {
          const uploadRes = await CloudinaryService.uploadDocument(userId.toString(), screenshot, 'deposits', req);
          deposit.paymentScreenshot = uploadRes?.secure_url || screenshot;
        } catch (uploadErr) {
          console.warn('[Deposit Screenshot Upload Warning]:', uploadErr.message);
          deposit.paymentScreenshot = screenshot;
        }
      } else {
        deposit.paymentScreenshot = screenshot;
      }
    }

    deposit.paidAt = deposit.paidAt || new Date();

    // If autoApprove is true (or admin trigger), transition directly to SUCCESS & credit wallet
    if (autoApprove) {
      return await this._creditAndMarkSuccess(deposit, cleanedUtr || deposit.utr || 'AUTO_VERIFIED');
    }

    // Default flow: set status to VERIFICATION_PENDING
    deposit.status = 'VERIFICATION_PENDING';
    await deposit.save();

    return {
      success: true,
      message: 'Payment details submitted for verification',
      deposit: {
        id: deposit._id.toString(),
        amount: deposit.amount,
        status: deposit.status,
        paymentReference: deposit.paymentReference,
        utr: deposit.utr,
        paymentScreenshot: deposit.paymentScreenshot,
        paidAt: deposit.paidAt
      }
    };
  }

  /**
   * Admin / Automated System Approval to mark deposit as SUCCESS and credit wallet atomically.
   */
  static async _creditAndMarkSuccess(depositDoc, utrNumber) {
    const depositId = depositDoc._id;
    const userId = depositDoc.user;

    // IDEMPOTENT ATOMIC STATUS UPDATE:
    // Update ONLY if status is PENDING or VERIFICATION_PENDING
    const updatedDeposit = await Deposit.findOneAndUpdate(
      {
        _id: depositId,
        status: { $in: ['PENDING', 'VERIFICATION_PENDING'] }
      },
      {
        $set: {
          status: 'SUCCESS',
          utr: utrNumber || depositDoc.utr,
          paidAt: depositDoc.paidAt || new Date(),
          verifiedAt: new Date()
        }
      },
      { new: true }
    );

    // If updatedDeposit is null, it means it was ALREADY processed to SUCCESS (or cancelled/failed)
    if (!updatedDeposit) {
      // Re-fetch current state
      const currentDeposit = await Deposit.findById(depositId);
      if (currentDeposit && currentDeposit.status === 'SUCCESS') {
        return {
          success: true,
          message: 'Deposit already credited (idempotent)',
          deposit: {
            id: currentDeposit._id.toString(),
            amount: currentDeposit.amount,
            status: currentDeposit.status,
            paymentReference: currentDeposit.paymentReference,
            utr: currentDeposit.utr,
            verifiedAt: currentDeposit.verifiedAt
          }
        };
      }
      const err = new Error('Deposit cannot be credited due to invalid status');
      err.statusCode = 400;
      err.code = 'IDEMPOTENCY_OR_STATUS_ERROR';
      throw err;
    }

    // Atomic Wallet Credit
    try {
      await WalletService.credit({
        userId: userId,
        amount: updatedDeposit.amount,
        type: 'deposit',
        reference: updatedDeposit.paymentReference,
        metadata: {
          depositId: updatedDeposit._id.toString(),
          paymentReference: updatedDeposit.paymentReference,
          utr: updatedDeposit.utr
        }
      });
    } catch (creditErr) {
      console.error('Wallet credit failed for verified deposit:', creditErr);
      // Rollback status if wallet credit fails
      await Deposit.findByIdAndUpdate(depositId, { $set: { status: 'FAILED' } });
      const err = new Error('Wallet crediting failed. Please try again or contact support.');
      err.statusCode = 500;
      err.code = 'WALLET_CREDIT_ERROR';
      throw err;
    }

    return {
      success: true,
      message: 'Deposit verified and wallet credited successfully',
      deposit: {
        id: updatedDeposit._id.toString(),
        amount: updatedDeposit.amount,
        status: updatedDeposit.status,
        paymentReference: updatedDeposit.paymentReference,
        utr: updatedDeposit.utr,
        verifiedAt: updatedDeposit.verifiedAt
      }
    };
  }

  /**
   * Admin Endpoint to approve deposit by ID.
   */
  static async adminApproveDeposit({ depositId, utr }) {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(depositId)) {
      query._id = depositId;
    } else {
      query.paymentReference = depositId;
    }

    const deposit = await Deposit.findOne(query);
    if (!deposit) {
      const err = new Error('Deposit request not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    return await this._creditAndMarkSuccess(deposit, utr || deposit.utr);
  }

  /**
   * Get deposit history for user.
   */
  static async getDepositHistory({ userId, page = 1, limit = 20 }) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (parsedPage - 1) * parsedLimit;

    const [deposits, total] = await Promise.all([
      Deposit.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Deposit.countDocuments({ user: userId })
    ]);

    const formattedDeposits = deposits.map((d) => ({
      id: d._id.toString(),
      amount: d.amount,
      currency: d.currency,
      status: d.status,
      paymentReference: d.paymentReference,
      upiId: d.upiId,
      utr: d.utr,
      createdAt: d.createdAt,
      paidAt: d.paidAt,
      verifiedAt: d.verifiedAt
    }));

    return {
      success: true,
      deposits: formattedDeposits,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit)
      }
    };
  }
}
