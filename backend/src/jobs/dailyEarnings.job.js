import cron from 'node-cron';
import { Investment } from '../models/Investment.js';
import { Earning } from '../models/Earning.js';
import { WalletService } from '../services/wallet.service.js';
import { Notification } from '../models/Notification.js';

export const runDailyEarningsEngine = async () => {
  console.log('[Daily Earnings Job Started]: Processing daily returns...');

  const todayStr = new Date().toISOString().substring(0, 10);
  const activeInvestments = await Investment.find({ status: 'active' });

  let processedCount = 0;
  let skippedCount = 0;

  for (const investment of activeInvestments) {
    try {
      // 1. Check idempotency: Has this investment already received earning for today?
      const existingEarning = await Earning.findOne({
        user: investment.user,
        investment: investment._id,
        earningDate: todayStr
      });

      if (existingEarning) {
        skippedCount++;
        continue;
      }

      // 2. Credit user wallet via WalletService
      const { transaction } = await WalletService.credit({
        userId: investment.user,
        amount: investment.dailyEarning,
        type: 'daily_earning',
        reference: `Daily Return — ${investment.planName}`,
        metadata: {
          investmentId: investment._id.toString(),
          earningDate: todayStr
        }
      });

      // 3. Create unique Earning document
      const earningDoc = await Earning.create({
        user: investment.user,
        investment: investment._id,
        amount: investment.dailyEarning,
        earningDate: todayStr,
        type: 'daily',
        status: 'credited',
        transaction: transaction._id
      });

      // 4. Update Investment statistics & completion state
      investment.completedDays += 1;
      investment.totalEarned += investment.dailyEarning;
      investment.nextEarningAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      if (investment.completedDays >= investment.durationDays) {
        investment.status = 'completed';
      }
      await investment.save();

      // 5. Notify user
      await Notification.create({
        user: investment.user,
        title: 'Daily Earning Credited',
        message: `+₹${investment.dailyEarning.toLocaleString()} daily return from ${investment.planName} was added to your wallet.`,
        type: 'dollar',
        category: 'Earnings'
      });

      processedCount++;
    } catch (err) {
      if (err.code === 11000) {
        // Mongo duplicate key error due to unique compound index idempotency constraint
        skippedCount++;
      } else {
        console.error(`[Daily Earning Error for Investment ${investment._id}]:`, err.message);
      }
    }
  }

  console.log(`[Daily Earnings Job Completed]: Processed ${processedCount} investments, Skipped ${skippedCount} duplicates.`);
  return { processedCount, skippedCount };
};

// Schedule job every day at 00:05 AM
export const initDailyEarningsCron = () => {
  cron.schedule('5 0 * * *', async () => {
    await runDailyEarningsEngine();
  });
  console.log('[Cron Job Initialized]: Daily earnings scheduled at 00:05 AM UTC');
};
