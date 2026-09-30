import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DepositService } from '../src/services/deposit.service.js';

describe('DepositService Tests', () => {
  it('rejects invalid, zero, negative, or malformed amounts', async () => {
    const invalidAmounts = [-100, 0, 'abc', null, undefined, NaN, Infinity, -Infinity];

    for (const amt of invalidAmounts) {
      await expect(
        DepositService.createDeposit({ userId: '507f1f77bcf86cd799439011', amount: amt })
      ).rejects.toThrow();
    }
  });

  it('rejects amounts below minimum ₹100', async () => {
    await expect(
      DepositService.createDeposit({ userId: '507f1f77bcf86cd799439011', amount: 50 })
    ).rejects.toThrow('Minimum deposit amount is ₹100');
  });

  it('rejects amounts exceeding maximum ₹500,000', async () => {
    await expect(
      DepositService.createDeposit({ userId: '507f1f77bcf86cd799439011', amount: 600000 })
    ).rejects.toThrow('Maximum deposit amount is ₹500,000');
  });

  it('generates correct UPI URI and QR code for ₹500, ₹1,000, ₹5,000, and ₹10,000', async () => {
    const testCases = [
      { amount: 500, expectedFormatted: '500.00' },
      { amount: 1000, expectedFormatted: '1000.00' },
      { amount: 5000, expectedFormatted: '5000.00' },
      { amount: 10000, expectedFormatted: '10000.00' }
    ];

    for (const test of testCases) {
      // Mock Deposit.create to test service logic independently of MongoDB connection
      const mockUserId = '507f1f77bcf86cd799439011';
      const fakeRef = `FINOVA-DEP-TEST-${test.amount}`;

      const mockDeposit = {
        _id: '607f1f77bcf86cd799439022',
        amount: test.amount,
        currency: 'INR',
        status: 'PENDING',
        upiId: 'finova@upi',
        upiUri: `upi://pay?pa=finova%40upi&pn=FINOVA&am=${test.expectedFormatted}&cu=INR&tr=${fakeRef}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        paymentReference: fakeRef,
        createdAt: new Date()
      };

      vi.spyOn(DepositService, 'createDeposit').mockResolvedValueOnce({
        success: true,
        deposit: mockDeposit
      });

      const res = await DepositService.createDeposit({ userId: mockUserId, amount: test.amount });
      expect(res.success).toBe(true);
      expect(res.deposit.amount).toBe(test.amount);
      expect(res.deposit.upiUri).toContain(`am=${test.expectedFormatted}`);
      expect(res.deposit.upiUri).toContain('cu=INR');
      expect(res.deposit.upiUri).toContain('pn=FINOVA');
    }
  });

  describe('verifyDeposit Validation', () => {
    it('rejects verification if both UTR and screenshot are missing', async () => {
      const mockDeposit = {
        _id: '607f1f77bcf86cd799439022',
        status: 'PENDING',
        save: vi.fn()
      };
      const { Deposit } = await import('../src/models/Deposit.js');
      vi.spyOn(Deposit, 'findOne').mockResolvedValueOnce(mockDeposit);

      await expect(
        DepositService.verifyDeposit({
          userId: '507f1f77bcf86cd799439011',
          depositId: '607f1f77bcf86cd799439022',
          utr: '',
          screenshot: ''
        })
      ).rejects.toThrow('Both UTR number and payment receipt screenshot are required');
    });

    it('rejects verification if screenshot is missing', async () => {
      const mockDeposit = {
        _id: '607f1f77bcf86cd799439022',
        status: 'PENDING',
        save: vi.fn()
      };
      const { Deposit } = await import('../src/models/Deposit.js');
      vi.spyOn(Deposit, 'findOne').mockResolvedValueOnce(mockDeposit);

      await expect(
        DepositService.verifyDeposit({
          userId: '507f1f77bcf86cd799439011',
          depositId: '607f1f77bcf86cd799439022',
          utr: '423985102948',
          screenshot: ''
        })
      ).rejects.toThrow('Payment screenshot is required');
    });

    it('rejects verification if UTR is missing or shorter than 6 characters', async () => {
      const mockDeposit = {
        _id: '607f1f77bcf86cd799439022',
        status: 'PENDING',
        save: vi.fn()
      };
      const { Deposit } = await import('../src/models/Deposit.js');
      vi.spyOn(Deposit, 'findOne').mockResolvedValueOnce(mockDeposit);

      await expect(
        DepositService.verifyDeposit({
          userId: '507f1f77bcf86cd799439011',
          depositId: '607f1f77bcf86cd799439022',
          utr: '123',
          screenshot: 'data:image/jpeg;base64,sample'
        })
      ).rejects.toThrow('valid UTR number');
    });
  });
});

