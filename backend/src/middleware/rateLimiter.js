import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'TOO_MANY_REQUESTS'
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // stricter limit for login/register
  message: {
    success: false,
    message: 'Too many login/register attempts. Please try again in 15 minutes.',
    code: 'AUTH_RATE_LIMIT'
  }
});

export const financialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // rate limit for withdrawals and payment creation
  message: {
    success: false,
    message: 'Rate limit reached for financial transactions. Please slow down.',
    code: 'FINANCIAL_RATE_LIMIT'
  }
});
