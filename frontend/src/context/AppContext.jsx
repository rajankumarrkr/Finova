import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import * as dashboardService from '../services/dashboardService';
import * as planService from '../services/planService';
import * as investmentService from '../services/investmentService';
import * as earningService from '../services/earningService';
import * as referralService from '../services/referralService';
import * as transactionService from '../services/transactionService';
import * as withdrawalService from '../services/withdrawalService';
import * as bankService from '../services/bankService';
import { getErrorMessage } from '../utils/errorHandler';
import { TELEGRAM_SUPPORT_URL, openTelegramSupport, getTelegramSupportUrl } from '../config/support';

const AppContext = createContext();

const initialUserData = {
  id: '',
  name: 'Investor',
  email: '',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  referralCode: '',
  kycStatus: 'Verified',
  balances: {
    totalBalance: 0,
    availableBalance: 0,
    withdrawableBalance: 0,
    totalInvested: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    referralEarnings: 0,
  },
  stats: {
    lifetimeInvested: 0,
    activeInvestmentsCount: 0,
    completedPlansCount: 0,
  },
  memberSince: '2026',
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserData);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('finova_token');
  });
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Lists
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [plans, setPlans] = useState([]);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000);
  }, []);

  const closeToast = useCallback(() => {
    setToast({ show: false, message: '', type: 'info' });
  }, []);

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState(null);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [_isSupportOpen, _setIsSupportOpen] = useState(false);
  const setIsSupportOpen = useCallback((open) => {
    if (open) {
      openTelegramSupport();
    }
    _setIsSupportOpen(open);
  }, []);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Fetch all user domain data from API
  const refreshAppData = useCallback(async () => {
    if (!localStorage.getItem('finova_token')) return;

    try {
      const [
        meRes,
        dashRes,
        invRes,
        txnRes,
        bankRes,
        plansRes,
      ] = await Promise.allSettled([
        authService.getMe(),
        dashboardService.getDashboard(),
        investmentService.getInvestments(),
        transactionService.getTransactions(),
        bankService.getBankAccounts(),
        planService.getPlans(),
      ]);

      // 1. Authenticated User Profile
      if (meRes.status === 'fulfilled' && meRes.value?.success && meRes.value?.data?.user) {
        const u = meRes.value.data.user;
        const b = u.balances || {};
        setUser((prev) => ({
          ...prev,
          id: u.id || u._id,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          avatar: (typeof u.avatar === 'object' && u.avatar?.url) ? u.avatar.url : (u.avatar || prev.avatar),
          avatarData: typeof u.avatar === 'object' ? u.avatar : { url: u.avatar || prev.avatar, publicId: null },
          role: u.role || prev.role || 'user',
          referralCode: u.referralCode || prev.referralCode,
          kycStatus: u.kycStatus || 'Verified',
          memberSince: u.memberSince ? new Date(u.memberSince).getFullYear().toString() : '2026',
          balances: {
            availableBalance: b.availableBalance || 0,
            withdrawableBalance: b.withdrawableBalance || b.availableBalance || 0,
            totalInvested: b.totalInvested || 0,
            totalEarnings: b.totalEarnings || 0,
            totalReferralEarnings: b.totalReferralEarnings || 0,
            referralEarnings: b.totalReferralEarnings || 0,
            todayEarnings: prev.balances?.todayEarnings || 0,
            totalBalance: (b.availableBalance || 0) + (b.totalInvested || 0),
          },
        }));
      }

      // 2. Dashboard Metrics
      if (dashRes.status === 'fulfilled' && dashRes.value?.success && dashRes.value?.data) {
        const d = dashRes.value.data;
        setDashboardData(d);
        setUser((prev) => ({
          ...prev,
          balances: {
            ...prev.balances,
            totalBalance: d.totalBalance ?? (d.availableBalance + d.totalInvested),
            availableBalance: d.availableBalance ?? prev.balances.availableBalance,
            totalInvested: d.totalInvested ?? prev.balances.totalInvested,
            totalEarnings: d.totalEarnings ?? prev.balances.totalEarnings,
            todayEarnings: d.todayEarnings ?? prev.balances.todayEarnings,
          },
          stats: {
            ...prev.stats,
            activeInvestmentsCount: d.activeInvestments ?? prev.stats.activeInvestmentsCount,
            lifetimeInvested: d.totalInvested ?? prev.stats.lifetimeInvested,
          },
        }));
      }

      // 3. Investments
      if (invRes.status === 'fulfilled' && invRes.value?.success && Array.isArray(invRes.value.data)) {
        const formatted = invRes.value.data.map((inv) => ({
          id: inv._id || inv.id,
          planName: inv.planName || inv.plan?.name || 'Investment Plan',
          badge: inv.badge || inv.plan?.badge || 'ACTIVE',
          amount: inv.amount,
          dailyEarning: inv.dailyEarning,
          durationDays: inv.durationDays,
          completedDays: inv.completedDays || 0,
          totalEarnedSoFar: inv.totalEarned || 0,
          nextEarning: inv.nextEarningAt ? new Date(inv.nextEarningAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
          startDate: inv.startDate ? new Date(inv.startDate).toLocaleDateString() : 'Today',
          endDate: inv.endDate ? new Date(inv.endDate).toLocaleDateString() : '',
          color: inv.color || inv.plan?.color || 'emerald',
          status: inv.status,
        }));
        setActiveInvestments(formatted);
      }

      // 4. Transactions
      if (txnRes.status === 'fulfilled' && txnRes.value?.success) {
        const rawList = txnRes.value.data?.transactions || (Array.isArray(txnRes.value.data) ? txnRes.value.data : []);
        const formattedTxns = rawList.map((t) => {
          let category = 'Investments';
          if (t.type === 'daily_earning' || t.type === 'earnings') category = 'Earnings';
          else if (t.type === 'withdrawal' || t.type === 'withdrawals') category = 'Withdrawals';
          else if (t.type === 'referral_bonus' || t.type === 'referrals') category = 'Referrals';

          return {
            id: t._id || t.transactionId,
            type: t.type,
            title: t.reference || t.type?.replace('_', ' ')?.toUpperCase() || 'Transaction',
            amount: t.amount,
            isPositive: t.direction === 'credit',
            date: t.createdAt ? new Date(t.createdAt).toLocaleString() : 'Recently',
            rawDate: t.createdAt,
            status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Completed',
            category,
            reference: t.transactionId || t.reference || '',
          };
        });
        setTransactions(formattedTxns);
      }

      // 5. Bank Accounts
      if (bankRes.status === 'fulfilled' && bankRes.value?.success && Array.isArray(bankRes.value.data)) {
        const formattedBanks = bankRes.value.data.map((b) => ({
          id: b.id || b._id,
          bankName: b.bankName,
          accountNumber: b.accountNumber,
          holderName: b.accountHolderName,
          ifscCode: b.ifsc,
          status: b.isVerified ? 'Verified' : 'Pending',
          isDefault: !!b.isPrimary,
        }));
        setBankAccounts(formattedBanks);
      }

      // 6. Investment Plans
      if (plansRes.status === 'fulfilled' && plansRes.value?.success && Array.isArray(plansRes.value.data)) {
        setPlans(plansRes.value.data);
      }
    } catch (e) {
      console.error('Error refreshing app data from API:', e);
    }
  }, []);

  // Initial Check Me on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('finova_token');
      if (token) {
        try {
          setIsAuthenticated(true);
          await refreshAppData();
        } catch (err) {
          localStorage.removeItem('finova_token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshAppData]);

  // Listen for automatic logout events triggered by Axios Interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      setIsAuthenticated(false);
      setUser(initialUserData);
      showToast('Session expired. Please sign in again.', 'error');
    };
    window.addEventListener('finova_auth_logout', handleAuthLogout);
    return () => window.removeEventListener('finova_auth_logout', handleAuthLogout);
  }, [showToast]);

  // Authentication Handlers
  const login = async (identifier, password) => {
    try {
      const res = await authService.login({ identifier, password });
      if (res?.success && res?.data?.accessToken) {
        localStorage.setItem('finova_token', res.data.accessToken);
        setIsAuthenticated(true);
        const name = res.data.user?.name ? res.data.user.name.split(' ')[0] : 'User';
        showToast(`Welcome back, ${name}!`, 'success');
        await refreshAppData();
        return { success: true };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (err) {
      const msg = getErrorMessage(err, 'Mobile number or password is incorrect');
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, mobile, password, referralCode) => {
    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const userData = {
        name,
        email: `${cleanMobile}@finova.app`,
        phone: `+91 ${cleanMobile}`,
        password,
        ...(referralCode ? { referralCode: referralCode.trim() } : {}),
      };

      const res = await authService.register(userData);
      if (res?.success && res?.data?.accessToken) {
        localStorage.setItem('finova_token', res.data.accessToken);
        setIsAuthenticated(true);
        showToast(`Account created successfully! Welcome to Finova, ${name.split(' ')[0]}.`, 'success');
        await refreshAppData();
        return { success: true };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to create account. Please try again.');
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('finova_token');
      localStorage.removeItem('finova_user');
      localStorage.removeItem('finova_auth');
      setIsAuthenticated(false);
      setUser(initialUserData);
      showToast('Logged out of session', 'info');
    }
  };

  // Action: Open Invest Modal
  const openInvestModal = (plan) => {
    if (plan) {
      setSelectedPlanForInvest(plan);
    } else if (plans && plans.length > 0) {
      setSelectedPlanForInvest(plans[0]);
    }
    setIsInvestOpen(true);
  };

  // Action: Confirm Investment
  const handleInvestSubmit = async (plan, amount) => {
    const planId = plan._id || plan.id;
    if (!planId) {
      showToast('Invalid investment plan', 'error');
      return false;
    }

    try {
      const res = await investmentService.createInvestment(planId);
      if (res?.success) {
        showToast(`Successfully invested ₹${amount?.toLocaleString()} in ${plan.name}!`, 'success');
        setIsInvestOpen(false);
        await refreshAppData();
        return true;
      }
      showToast(res?.message || 'Investment failed', 'error');
      return false;
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to activate investment plan');
      showToast(msg, 'error');
      return false;
    }
  };

  // Action: Confirm Deposit (Simulated / Payment API)
  const handleDepositSubmit = (amount, paymentMethod) => {
    const depAmount = parseFloat(amount);
    if (!depAmount || depAmount <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      balances: {
        ...prev.balances,
        totalBalance: prev.balances.totalBalance + depAmount,
        availableBalance: prev.balances.availableBalance + depAmount,
        withdrawableBalance: prev.balances.withdrawableBalance + depAmount,
      },
    }));

    showToast(`Deposit of ₹${depAmount.toLocaleString()} added to wallet!`, 'success');
    setIsDepositOpen(false);
    return true;
  };

  // Action: Confirm Withdrawal
  const handleWithdrawSubmit = async (amount, bankAccountId) => {
    const withAmount = parseFloat(amount);
    if (!withAmount || withAmount <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return false;
    }

    if (!bankAccountId) {
      showToast('Please select a valid bank account', 'error');
      return false;
    }

    try {
      const res = await withdrawalService.requestWithdrawal({
        amount: withAmount,
        bankAccountId,
      });

      if (res?.success) {
        showToast(`Withdrawal request for ₹${withAmount.toLocaleString()} submitted!`, 'success');
        setIsWithdrawOpen(false);
        await refreshAppData();
        return true;
      }
      showToast(res?.message || 'Withdrawal failed', 'error');
      return false;
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to process withdrawal request');
      showToast(msg, 'error');
      return false;
    }
  };

  // Action: Add Bank Account
  const handleAddBankAccount = async (accountData) => {
    try {
      const res = await bankService.addBankAccount({
        accountHolderName: accountData.holderName || accountData.accountHolderName,
        bankName: accountData.bankName,
        accountNumber: accountData.accountNumber,
        ifsc: accountData.ifscCode || accountData.ifsc,
      });

      if (res?.success) {
        showToast(`${accountData.bankName} linked successfully!`, 'success');
        setIsAddBankOpen(false);
        await refreshAppData();
        return true;
      }
      showToast(res?.message || 'Failed to add bank account', 'error');
      return false;
    } catch (err) {
      const msg = getErrorMessage(err, 'Error linking bank account');
      showToast(msg, 'error');
      return false;
    }
  };

  // Action: Delete Bank Account
  const handleDeleteBankAccount = async (id) => {
    try {
      const res = await bankService.deleteBankAccount(id);
      if (res?.success) {
        showToast('Bank account unlinked successfully', 'info');
        await refreshAppData();
        return true;
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Error deleting bank account'), 'error');
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshAppData,
        dashboardData,
        plans,
        setPlans,
        activeInvestments,
        transactions,
        bankAccounts,
        toast,
        showToast,
        closeToast,
        // Modals
        isDepositOpen,
        setIsDepositOpen,
        isWithdrawOpen,
        setIsWithdrawOpen,
        isInvestOpen,
        setIsInvestOpen,
        selectedPlanForInvest,
        openInvestModal,
        isAddBankOpen,
        setIsAddBankOpen,
        isSupportOpen: _isSupportOpen,
        setIsSupportOpen,
        openTelegramSupport,
        getTelegramSupportUrl,
        TELEGRAM_SUPPORT_URL,
        isEditProfileOpen,
        setIsEditProfileOpen,
        // Handlers
        handleInvestSubmit,
        handleDepositSubmit,
        handleWithdrawSubmit,
        handleAddBankAccount,
        handleDeleteBankAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
