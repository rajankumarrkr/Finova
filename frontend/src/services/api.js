import api from '../lib/api';
import * as authService from './authService';
import * as dashboardService from './dashboardService';
import * as planService from './planService';
import * as investmentService from './investmentService';
import * as earningService from './earningService';
import * as referralService from './referralService';
import * as transactionService from './transactionService';
import * as withdrawalService from './withdrawalService';
import * as bankService from './bankService';
import * as userService from './userService';

export const apiService = {
  // Auth
  register: authService.register,
  login: authService.login,
  logout: authService.logout,
  refresh: authService.refresh,
  getMe: authService.getMe,

  // User & Avatar
  uploadAvatar: userService.uploadAvatar,
  deleteAvatar: userService.deleteAvatar,
  updateProfile: userService.updateProfile,

  // Dashboard
  getDashboard: dashboardService.getDashboard,
  getPerformance: dashboardService.getPerformance,

  // Plans
  getPlans: planService.getPlans,
  getPlanById: planService.getPlanById,

  // Investments
  createInvestment: investmentService.createInvestment,
  getInvestments: investmentService.getInvestments,
  getInvestmentById: investmentService.getInvestmentById,

  // Earnings
  getEarnings: earningService.getEarnings,
  getEarningsSummary: earningService.getEarningsSummary,

  // Referrals
  getReferralStats: referralService.getReferralStats,
  getReferralHistory: referralService.getReferralHistory,

  // Transactions
  getTransactions: transactionService.getTransactions,

  // Withdrawals
  requestWithdrawal: withdrawalService.requestWithdrawal,
  getWithdrawals: withdrawalService.getWithdrawals,

  // Bank Accounts
  getBankAccounts: bankService.getBankAccounts,
  addBankAccount: bankService.addBankAccount,
  deleteBankAccount: bankService.deleteBankAccount,
};

export default api;
