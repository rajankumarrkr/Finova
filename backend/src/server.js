import app from './app.js';
import { env } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { initDailyEarningsCron } from './jobs/dailyEarnings.job.js';
import { validateEncryptionKey } from './utils/encryption.js';
import { validateCloudinaryConfig } from './config/cloudinary.js';
import { bootstrapSystem } from './utils/bootstrap.js';

const startServer = async () => {
  try {
    // 0. Validate Security & Cloudinary Configuration
    validateEncryptionKey();
    validateCloudinaryConfig();

    // 1. Connect MongoDB
    await connectDB();

    // 1.1 Bootstrap System Defaults (Admin Account, Plans & Settings)
    await bootstrapSystem();

    // 2. Initialize Daily Earnings Cron Engine
    initDailyEarningsCron();

    // 3. Start HTTP Server
    const server = app.listen(env.PORT, () => {
      console.log(`====================================================`);
      console.log(`[Finova REST API Engine Live]: http://localhost:${env.PORT}`);
      console.log(`[Swagger API Documentation]:  http://localhost:${env.PORT}/api/docs`);
      console.log(`[Environment]: ${env.NODE_ENV}`);
      console.log(`====================================================`);
    });

    // Graceful Shutdown Handlers
    const handleExit = async (signal) => {
      console.log(`\n[${signal} Received]: Shutting down server gracefully...`);
      server.close(async () => {
        await closeDB();
        console.log('[Finova Backend Stopped]');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleExit('SIGINT'));
    process.on('SIGTERM', () => handleExit('SIGTERM'));

    process.on('unhandledRejection', (err) => {
      console.error('[Unhandled Rejection]:', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('[Uncaught Exception]:', err);
    });

  } catch (error) {
    console.error('[Server Initialization Error]:', error);
    process.exit(1);
  }
};

startServer();
