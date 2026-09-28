import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { InvestmentPlan } from '../models/InvestmentPlan.js';
import { Investment } from '../models/Investment.js';
import { BankAccount } from '../models/BankAccount.js';
import { Transaction } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import { generateTransactionId } from './transactionId.js';

const seedData = async () => {
  console.log('[Seed Script]: Connecting to database...');
  await connectDB();

  console.log('[Seed Script]: Clearing old demo collections...');
  await User.deleteMany({});
  await InvestmentPlan.deleteMany({});
  await Investment.deleteMany({});
  await BankAccount.deleteMany({});
  await Transaction.deleteMany({});
  await Notification.deleteMany({});

  console.log('[Seed Script]: Creating Admin & User accounts...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const admin = await User.create({
    name: 'Admin Manager',
    email: 'admin@finova.app',
    phone: '+91 90000 00000',
    passwordHash: adminPasswordHash,
    referralCode: 'ADMIN50',
    role: 'admin',
    kycStatus: 'verified'
  });

  const demoUser = await User.create({
    name: 'Rajan Kumar',
    email: 'rajan@example.com',
    phone: '+91 98765 43210',
    passwordHash,
    referralCode: 'RAJAN50',
    role: 'user',
    kycStatus: 'verified',
    wallet: {
      availableBalance: 4850.00,
      pendingBalance: 0,
      totalEarnings: 4850.00,
      totalReferralEarnings: 2450.00,
      totalInvested: 8000.00
    }
  });

  console.log('[Seed Script]: Creating Investment Plans...');
  const plans = await InvestmentPlan.create([
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

  console.log('[Seed Script]: Creating Active Investment...');
  const starterPlan = plans[0];
  const investment = await Investment.create({
    user: demoUser._id,
    plan: starterPlan._id,
    planName: starterPlan.name,
    badge: starterPlan.badge,
    color: starterPlan.color,
    amount: starterPlan.investmentAmount,
    dailyEarning: starterPlan.dailyEarning,
    durationDays: starterPlan.durationDays,
    completedDays: 37,
    totalEarned: 1850,
    startDate: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000),
    status: 'active'
  });

  console.log('[Seed Script]: Creating Linked Bank Account...');
  await BankAccount.create({
    user: demoUser._id,
    accountHolderName: demoUser.name,
    bankName: 'HDFC Bank',
    accountNumberEncrypted: 'encrypted_demo_acc_4521',
    accountNumberLast4: '4521',
    ifsc: 'HDFC0004521',
    isVerified: true,
    isPrimary: true
  });

  console.log('[Seed Script]: Creating Demo Transactions...');
  await Transaction.create([
    {
      transactionId: generateTransactionId('TXN'),
      user: demoUser._id,
      type: 'daily_earning',
      amount: 50,
      direction: 'credit',
      status: 'completed',
      reference: 'Starter Plan payout #37'
    },
    {
      transactionId: generateTransactionId('TXN'),
      user: demoUser._id,
      type: 'investment',
      amount: 5000,
      direction: 'debit',
      status: 'completed',
      reference: 'Starter Plan Activation'
    },
    {
      transactionId: generateTransactionId('TXN'),
      user: demoUser._id,
      type: 'referral_bonus',
      amount: 500,
      direction: 'credit',
      status: 'completed',
      reference: '10% reward on Rahul Kumar deposit'
    }
  ]);

  console.log('[Seed Script]: Creating Demo Notifications...');
  await Notification.create([
    {
      user: demoUser._id,
      title: 'Daily Earning Credited',
      message: '₹50.00 daily return from Starter Plan was successfully added to your balance.',
      type: 'dollar',
      category: 'Earnings'
    },
    {
      user: demoUser._id,
      title: 'Referral Reward Received',
      message: 'You received +₹500 referral bonus for team member activation.',
      type: 'users',
      category: 'Referral'
    }
  ]);

  console.log('----------------------------------------------------');
  console.log('[Seed Completed Successfully!]');
  console.log('Demo User Credentials:');
  console.log('  Email: rajan@example.com | Phone: +91 98765 43210 | Password: password123');
  console.log('Admin Credentials:');
  console.log('  Email: admin@finova.app | Password: admin123');
  console.log('----------------------------------------------------');

  await closeDB();
  process.exit(0);
};

seedData().catch(err => {
  console.error('[Seed Failed]:', err);
  process.exit(1);
});
