import crypto from 'crypto';
import { Payment } from '../models/Payment.js';
import { paymentConfig } from '../config/payment.js';
import { WalletService } from './wallet.service.js';

export class PaymentService {
  /**
   * Create Razorpay / Mock Order
   */
  static async createOrder(userId, amount) {
    if (!amount || amount < 100) {
      throw { statusCode: 400, message: 'Minimum deposit amount is ₹100', code: 'INVALID_AMOUNT' };
    }

    const providerOrderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      user: userId,
      provider: paymentConfig.provider,
      providerOrderId,
      amount,
      currency: 'INR',
      status: 'created'
    });

    return {
      id: payment._id,
      providerOrderId,
      amount,
      currency: 'INR',
      key: paymentConfig.keyId
    };
  }

  /**
   * Verify Razorpay Payment Signature and process deposit
   */
  static async verifyPayment({ userId, providerOrderId, providerPaymentId, signature }) {
    const payment = await Payment.findOne({ providerOrderId, user: userId });
    if (!payment) {
      throw { statusCode: 404, message: 'Payment order not found', code: 'PAYMENT_NOT_FOUND' };
    }

    if (payment.status === 'captured') {
      return payment; // Already processed idempotently
    }

    // Verify signature in razorpay mode or automatically pass in mock mode
    let isVerified = false;
    if (paymentConfig.provider === 'mock') {
      isVerified = true;
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', paymentConfig.keySecret)
        .update(`${providerOrderId}|${providerPaymentId}`)
        .digest('hex');
      isVerified = generatedSignature === signature;
    }

    if (!isVerified) {
      payment.status = 'failed';
      await payment.save();
      throw { statusCode: 400, message: 'Invalid payment signature verification failed', code: 'PAYMENT_VERIFICATION_FAILED' };
    }

    payment.status = 'captured';
    payment.providerPaymentId = providerPaymentId || `pay_${Date.now()}`;
    payment.signatureVerified = true;
    await payment.save();

    // Credit available balance
    await WalletService.credit({
      userId,
      amount: payment.amount,
      type: 'deposit',
      reference: `Deposit via ${paymentConfig.provider.toUpperCase()} (${payment.providerPaymentId})`,
      metadata: { paymentId: payment._id.toString() }
    });

    return payment;
  }

  /**
   * Process Provider Webhook
   */
  static async processWebhook(payload, signature) {
    if (paymentConfig.provider !== 'mock') {
      const expectedSignature = crypto
        .createHmac('sha256', paymentConfig.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw { statusCode: 400, message: 'Invalid webhook signature', code: 'WEBHOOK_INVALID' };
      }
    }

    const { event, payload: eventData } = payload;
    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = eventData.payment?.entity?.order_id || eventData.order?.entity?.id;
      const paymentId = eventData.payment?.entity?.id;

      const paymentDoc = await Payment.findOne({ providerOrderId: orderId });
      if (paymentDoc && paymentDoc.status !== 'captured') {
        await this.verifyPayment({
          userId: paymentDoc.user,
          providerOrderId: orderId,
          providerPaymentId: paymentId,
          signature: 'webhook_bypass'
        });
      }
    }

    return { processed: true };
  }
}
