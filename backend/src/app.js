import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requestId } from './middleware/requestId.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import planRoutes from './routes/plan.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import earningRoutes from './routes/earning.routes.js';
import referralRoutes from './routes/referral.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import withdrawalRoutes from './routes/withdrawal.routes.js';
import bankRoutes from './routes/bank.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Controllers for root level shortcuts
import { getDashboard, getPerformance } from './controllers/user.controller.js';
import { protect } from './middleware/auth.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
}));

// Body & Cookie Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(requestId);

// Global Rate Limiting
app.use('/api', apiLimiter);

// Swagger Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Finova API Engine Operational', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', userRoutes); // Dashboard metrics & performance endpoints
app.use('/api/plans', planRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/bank-accounts', bankRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
