import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDailyEarningsEngine } from '../src/jobs/dailyEarnings.job.js';
import { Investment } from '../src/models/Investment.js';
import { Earning } from '../src/models/Earning.js';
import { AuditLog } from '../src/models/AuditLog.js';
import { WalletService } from '../src/services/wallet.service.js';

describe('Daily Earnings Engine Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully processes active investments and credits wallets', async () => {
    const mockInvestment = {
      _id: 'inv_123',
      user: {
        _id: 'user_456',
        name: 'Test Investor',
        email: 'investor@test.com'
      },
      planName: 'Gold Growth Plan',
      dailyEarning: 250,
      durationDays: 30,
      completedDays: 5,
      totalEarned: 1250,
      status: 'active',
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Investment, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue([mockInvestment])
    });

    vi.spyOn(Earning, 'findOne').mockResolvedValue(null);
    vi.spyOn(WalletService, 'credit').mockResolvedValue({
      user: { _id: 'user_456' },
      transaction: { _id: 'txn_999' }
    });
    vi.spyOn(Earning, 'create').mockResolvedValue({ _id: 'earn_777' });
    vi.spyOn(AuditLog, 'create').mockResolvedValue({ _id: 'audit_888' });

    const result = await runDailyEarningsEngine({ force: false, actorId: 'admin_001' });

    expect(result.processedCount).toBe(1);
    expect(result.skippedCount).toBe(0);
    expect(result.totalAmountCredited).toBe(250);
    expect(mockInvestment.completedDays).toBe(6);
    expect(mockInvestment.totalEarned).toBe(1500);
    expect(mockInvestment.save).toHaveBeenCalled();
    expect(WalletService.credit).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user_456',
        amount: 250,
        type: 'daily_earning'
      })
    );
    expect(AuditLog.create).toHaveBeenCalled();
  });

  it('skips investments that have already received earnings today when force is false', async () => {
    const mockInvestment = {
      _id: 'inv_123',
      user: { _id: 'user_456', name: 'Test Investor' },
      planName: 'Gold Growth Plan',
      dailyEarning: 250,
      durationDays: 30,
      completedDays: 5,
      totalEarned: 1250,
      status: 'active',
      save: vi.fn()
    };

    vi.spyOn(Investment, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue([mockInvestment])
    });

    // Simulate already credited today
    vi.spyOn(Earning, 'findOne').mockResolvedValue({ _id: 'existing_earn_1' });
    vi.spyOn(WalletService, 'credit');

    const result = await runDailyEarningsEngine({ force: false });

    expect(result.processedCount).toBe(0);
    expect(result.skippedCount).toBe(1);
    expect(result.totalAmountCredited).toBe(0);
    expect(WalletService.credit).not.toHaveBeenCalled();
    expect(mockInvestment.save).not.toHaveBeenCalled();
  });

  it('credits earnings even if already credited today when force is true', async () => {
    const mockInvestment = {
      _id: 'inv_123',
      user: { _id: 'user_456', name: 'Test Investor' },
      planName: 'Gold Growth Plan',
      dailyEarning: 250,
      durationDays: 30,
      completedDays: 5,
      totalEarned: 1250,
      status: 'active',
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Investment, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue([mockInvestment])
    });

    vi.spyOn(Earning, 'findOne').mockResolvedValue({ _id: 'existing_earn_1' });
    vi.spyOn(WalletService, 'credit').mockResolvedValue({
      user: { _id: 'user_456' },
      transaction: { _id: 'txn_999' }
    });
    vi.spyOn(Earning, 'create').mockResolvedValue({ _id: 'earn_778' });

    const result = await runDailyEarningsEngine({ force: true, actorId: 'admin_001' });

    expect(result.processedCount).toBe(1);
    expect(result.skippedCount).toBe(0);
    expect(result.totalAmountCredited).toBe(250);
    expect(WalletService.credit).toHaveBeenCalled();
  });

  it('marks investment as completed when completedDays reaches durationDays', async () => {
    const mockInvestment = {
      _id: 'inv_final',
      user: { _id: 'user_999', name: 'Completing Investor' },
      planName: 'Starter 7-Day',
      dailyEarning: 100,
      durationDays: 7,
      completedDays: 6,
      totalEarned: 600,
      status: 'active',
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Investment, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue([mockInvestment])
    });

    vi.spyOn(Earning, 'findOne').mockResolvedValue(null);
    vi.spyOn(WalletService, 'credit').mockResolvedValue({
      user: { _id: 'user_999' },
      transaction: { _id: 'txn_final' }
    });
    vi.spyOn(Earning, 'create').mockResolvedValue({ _id: 'earn_final' });

    const result = await runDailyEarningsEngine({ force: false });

    expect(result.processedCount).toBe(1);
    expect(mockInvestment.completedDays).toBe(7);
    expect(mockInvestment.status).toBe('completed');
    expect(mockInvestment.save).toHaveBeenCalled();
  });
});
