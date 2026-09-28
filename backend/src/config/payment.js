import { env } from './env.js';

export const paymentConfig = {
  provider: env.PAYMENT_PROVIDER, // 'razorpay' | 'mock'
  keyId: env.PAYMENT_KEY_ID,
  keySecret: env.PAYMENT_KEY_SECRET,
  webhookSecret: env.PAYMENT_WEBHOOK_SECRET,
  currency: 'INR'
};
