import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/finova',
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default_access_secret_123456789',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_123456789',
  
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'mock',
  PAYMENT_KEY_ID: process.env.PAYMENT_KEY_ID || 'rzp_test_mockkey12345',
  PAYMENT_KEY_SECRET: process.env.PAYMENT_KEY_SECRET || 'rzp_test_mocksecret67890',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_finova_webhook_secret_key_123',
  
  BANK_ENCRYPTION_KEY: process.env.BANK_ENCRYPTION_KEY || '0a856fdabc1f5827005117f73131eeb16578a3f7831bf748c40f0ff6cf69e7fe',

  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@finova.app',

  FINOVA_UPI_ID: process.env.FINOVA_UPI_ID || 'finova@upi',
  FINOVA_MERCHANT_NAME: process.env.FINOVA_MERCHANT_NAME || 'FINOVA'
};
