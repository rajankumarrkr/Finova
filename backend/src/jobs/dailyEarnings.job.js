import cron from 'node-cron';
import { Investment } from '../models/Investment.js';
import { Earning } from '../models/Earning.js';
import { AuditLog } from '../models/AuditLog.js';
import { WalletService } from '../services/wallet.service.js';

export const runDailyEarningsEngine = async ({
  force = false,
  investmentId = null,
  actorId = null
} = {}) => {
  console.log(`[Daily Earnings Job Started]: Processing daily returns (force=${force}, investmentId=${investmentId || 'all'})...`);

  const todayStr = new Date().toISOString().substring(0, 10);
  const query = { status: 'active' };
  if (investmentId) {
    query._id = investmentId;
  }

  const activeInvestments = await Investment.find(query).populate('user', 'name email phone wallet status');

  let processedCount = 0;
  let skippedCount = 0;
  let totalAmountCredited = 0;
  const processedItems = [];
  const skippedItems = [];

  for (const investment of activeInvestments) {
    try {
      const userId = investment.user?._id || investment.user;
      if (!userId) {
        skippedCount++;
        skippedItems.push({
          investmentId: investment._id,
          planName: investment.planName,
          reason: 'User not found'
        });
        continue;
      }

      // 1. Check idempotency: Has this investment already received earning for today?
      const existingEarning = await Earning.findOne({
        user: userId,
        investment: investment._id,
        earningDate: { $regex: `^${todayStr}` }
      });

      if (existingEarning && !force) {
        skippedCount++;
        skippedItems.push({
          investmentId: investment._id,
          planName: investment.planName,
          userName: investment.user?.name,
          reason: 'Already credited today'
        });
        continue;
      }

      const effectiveDate = (existingEarning && force)
        ? `${todayStr}_manual_${Date.now()}`
        : todayStr;

      // 2. Credit user wallet via WalletService
      const { transaction } = await WalletService.credit({
        userId,
        amount: investment.dailyEarning,
        type: 'daily_earning',
        reference: `Daily Return — ${investment.planName || 'Plan'}${force ? ' (Manual Payout)' : ''}`,
        metadata: {
          investmentId: investment._id.toString(),
          earningDate: effectiveDate,
          triggeredBy: actorId ? 'admin' : 'cron'
        }
      });

      // 3. Create unique Earning document
      await Earning.create({
        user: userId,
        investment: investment._id,
        amount: investment.dailyEarning,
        earningDate: effectiveDate,
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

      processedCount++;
      totalAmountCredited += investment.dailyEarning;
      processedItems.push({
        investmentId: investment._id,
        userId,
        userName: investment.user?.name || 'User',
        userEmail: investment.user?.email || '',
        planName: investment.planName,
        amount: investment.dailyEarning,
        completedDays: investment.completedDays,
        durationDays: investment.durationDays,
        isCompleted: investment.status === 'completed'
      });
    } catch (err) {
      if (err.code === 11000) {
        // Mongo duplicate key error due to unique compound index idempotency constraint
        skippedCount++;
        skippedItems.push({
          investmentId: investment._id,
          planName: investment.planName,
          reason: 'Duplicate key constraint (already credited today)'
        });
      } else {
        console.error(`[Daily Earning Error for Investment ${investment._id}]:`, err.message);
      }
    }
  }

  // 5. If triggered by an admin, log an audit trail
  if (actorId) {
    try {
      await AuditLog.create({
        actor: actorId,
        action: 'ADMIN_DISTRIBUTE_DAILY_EARNINGS',
        entity: 'Investment',
        metadata: {
          processedCount,
          skippedCount,
          totalAmountCredited,
          force,
          investmentId: investmentId ? investmentId.toString() : 'ALL'
        }
      });
    } catch (auditErr) {
      console.error('[Daily Earnings Audit Log Error]:', auditErr.message);
    }
  }

  console.log(`[Daily Earnings Job Completed]: Processed ${processedCount}, Skipped ${skippedCount}, Total Credited ₹${totalAmountCredited}.`);
  return {
    processedCount,
    skippedCount,
    totalAmountCredited,
    processedItems,
    skippedItems
  };
};

// Schedule job every day at 00:05 AM
export const initDailyEarningsCron = () => {
  cron.schedule('5 0 * * *', async () => {
    await runDailyEarningsEngine();
  });
  console.log('[Cron Job Initialized]: Daily earnings scheduled at 00:05 AM UTC');
};

