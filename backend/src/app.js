import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import path from 'path';

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
import depositRoutes from './routes/deposit.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
  'https://finova-sage.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

if (env.CLIENT_URL && !allowedOrigins.includes(env.CLIENT_URL)) {
  allowedOrigins.push(env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
      return callback(null, true);
    }
    return callback(null, true);
  },
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

// Static uploads serving (local development fallback)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Finova Backend',
    status: 'running'
  });
});

// Global Rate Limiting for API routes
app.use('/api', apiLimiter);

// Dedicated Health Check Endpoints
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    service: 'Finova Backend',
    status: 'healthy',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    service: 'Finova Backend',
    status: 'healthy',
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

// Swagger Documentation Route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', userRoutes);
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
app.use('/api/deposits', depositRoutes);
app.use('/api/deposit', depositRoutes);

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl || req.path
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
