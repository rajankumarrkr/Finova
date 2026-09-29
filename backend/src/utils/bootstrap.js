import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { Setting } from '../models/Setting.js';
import { env } from '../config/env.js';

export const bootstrapSystem = async () => {
  try {
    const adminEmail = (env.ADMIN_EMAIL || 'admin@finova.app').toLowerCase();
    const adminPassword = env.ADMIN_PASSWORD || 'admin123';

    // 1. Ensure Admin Account Exists
    const existingAdminByEmail = await User.findOne({ email: adminEmail }).select('+passwordHash');
    const existingAdminByRole = await User.findOne({ role: 'admin' });

    if (!existingAdminByEmail && !existingAdminByRole) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Admin Manager',
        email: adminEmail,
        phone: '+91 90000 00000',
        passwordHash,
        referralCode: 'ADMIN50',
        role: 'admin',
        kycStatus: 'verified',
        status: 'active'
      });
      console.log(`[Bootstrap]: Default Admin account auto-created (${adminEmail} / ${adminPassword})`);
    } else if (existingAdminByEmail && existingAdminByEmail.role !== 'admin') {
      existingAdminByEmail.role = 'admin';
      await existingAdminByEmail.save();
      console.log(`[Bootstrap]: Existing account (${adminEmail}) elevated to admin role`);
    }

    // 2. Ensure Investment Plans Exist
    const planCount = await InvestmentPlan.countDocuments();
    if (planCount === 0) {
      await InvestmentPlan.create([
        {
          name: 'Starter Plan',
          slug: 'starter-plan',
          badge: 'STARTER',
          investmentAmount: 5000,
          dailyEarning: 50,
          durationDays: 99,
          scheduledEarnings: 4950,
          roi: '99%',
          popular: false,
          color: 'emerald',
          features: ['Daily automated payout', 'Instant withdrawal eligible', 'Standard priority support', '0% platform fees'],
          status: 'active'
        },
        {
          name: 'Growth Plan',
          slug: 'growth-plan',
          badge: 'GROWTH',
          investmentAmount: 10000,
          dailyEarning: 100,
          durationDays: 99,
          scheduledEarnings: 9900,
          roi: '99%',
          popular: true,
          color: 'blue',
          features: ['2x Higher Daily Yield', 'Priority withdrawal processing', 'Dedicated relationship manager', 'Referral bonus boost eligible'],
          status: 'active'
        },
        {
          name: 'Premium Plan',
          slug: 'premium-plan',
          badge: 'PREMIUM',
          investmentAmount: 25000,
          dailyEarning: 250,
          durationDays: 99,
          scheduledEarnings: 24750,
          roi: '99%',
          popular: false,
          color: 'purple',
          features: ['Maximum Daily Return tier', 'VIP Fast-track withdrawals', '1-on-1 Portfolio Advisor', 'Exclusive quarterly dividend pool'],
          status: 'active'
        },
        {
          name: 'Elite VIP Plan',
          slug: 'elite-vip-plan',
          badge: 'VIP ELITE',
          investmentAmount: 50000,
          dailyEarning: 550,
          durationDays: 99,
          scheduledEarnings: 54450,
          roi: '108.9%',
          popular: false,
          color: 'amber',
          features: ['Highest yield potential', 'Instant 24/7 VIP desk support', 'Custom payout schedule options', 'Private investor club access'],
          status: 'active'
        }
      ]);
      console.log('[Bootstrap]: Default investment plans auto-initialized');
    }

    // 3. Ensure Default Payment Settings Exist
    const upiSetting = await Setting.findOne({ key: 'upiId' });
    if (!upiSetting) {
      await Setting.create({ key: 'upiId', value: env.FINOVA_UPI_ID || 'finova@upi' });
      await Setting.create({ key: 'merchantName', value: env.FINOVA_MERCHANT_NAME || 'FINOVA' });
      console.log('[Bootstrap]: Default UPI settings initialized');
    }
  } catch (error) {
    console.error('[Bootstrap Error]: Failed to bootstrap system data:', error.message);
  }
};
