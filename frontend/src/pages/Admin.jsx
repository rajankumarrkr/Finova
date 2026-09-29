import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { adminService } from '../services/adminService';
import * as authService from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Search,
  Check,
  X,
  Eye,
  LogOut,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileImage,
  RefreshCw,
  Lock,
  Settings,
  Briefcase,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

export const Admin = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, login, refreshAppData, showToast } = useApp();

  // Admin Login State
  const [adminIdentifier, setAdminIdentifier] = useState('admin@finova.app');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('deposits'); // 'deposits' | 'withdrawals' | 'users'
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  // Deposits State
  const [deposits, setDeposits] = useState([]);
  const [depositFilter, setDepositFilter] = useState('ALL');
  const [depositSearch, setDepositSearch] = useState('');
  const [loadingDeposits, setLoadingDeposits] = useState(false);

  // Withdrawals State
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState('ALL');
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Screenshot Preview Modal State
  const [previewImage, setPreviewImage] = useState(null);

  // Plans State
  const [plansList, setPlansList] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '', investmentAmount: '', dailyEarning: '', durationDays: '',
    badge: 'STARTER', popular: false, color: 'emerald', features: '', description: ''
  });
  const [savingPlan, setSavingPlan] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState(null);

  // Settings State
  const [settingsData, setSettingsData] = useState({ upiId: '', merchantName: '', qrCodeUrl: '' });
  const [settingsEditing, setSettingsEditing] = useState({ upiId: '', merchantName: '', qrCodeUrl: '' });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettingKey, setSavingSettingKey] = useState(null);

  // Action Loading ID
  const [actioningId, setActioningId] = useState(null);

  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await login(adminIdentifier.trim(), adminPassword);

      if (res?.success) {
        // Refresh app data to verify profile role
        await refreshAppData();
        showToast('Welcome to Finova Admin Portal!', 'success');
      } else {
        setLoginError(res?.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setLoginError(getErrorMessage(err, 'Failed to authenticate admin session'));
    } finally {
      setLoginLoading(false);
    }
  };

  // Quick fill admin credentials for testing
  const handleQuickFillAdmin = () => {
    setAdminIdentifier('admin@finova.app');
    setAdminPassword('admin123');
    setLoginError('');
  };

  // Fetch Admin Metrics & Data
  const fetchAdminMetrics = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingMetrics(true);
    try {
      const res = await adminService.getDashboard();
      if (res?.success) {
        setMetrics(res.data);
      }
    } catch (e) {
      console.error('Error fetching admin metrics:', e);
    } finally {
      setLoadingMetrics(false);
    }
  }, [isAdmin]);

  // Fetch Deposits
  const fetchDeposits = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingDeposits(true);
    try {
      const params = {};
      if (depositFilter !== 'ALL') params.status = depositFilter;
      if (depositSearch) params.search = depositSearch;

      const res = await adminService.getDeposits(params);
      if (res?.success) {
        setDeposits(res.data || []);
      }
    } catch (e) {
      console.error('Error fetching deposits:', e);
    } finally {
      setLoadingDeposits(false);
    }
  }, [isAdmin, depositFilter, depositSearch]);

  // Fetch Withdrawals
  const fetchWithdrawals = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingWithdrawals(true);
    try {
      const params = {};
      if (withdrawalFilter !== 'ALL') params.status = withdrawalFilter;

      const res = await adminService.getWithdrawals(params);
      if (res?.success) {
        setWithdrawals(res.data || []);
      }
    } catch (e) {
      console.error('Error fetching withdrawals:', e);
    } finally {
      setLoadingWithdrawals(false);
    }
  }, [isAdmin, withdrawalFilter]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const params = {};
      if (userSearch) params.search = userSearch;
      if (userFilter !== 'ALL') params.status = userFilter;

      const res = await adminService.getUsers(params);
      if (res?.success && res.data?.users) {
        setUsersList(res.data.users);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin, userSearch, userFilter]);

  // Fetch Settings
  const fetchSettings = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingSettings(true);
    try {
      const res = await adminService.getSettings();
      if (res?.success) {
        const data = res.data || {};
        setSettingsData(data);
        setSettingsEditing({
          upiId: data.upiId || '',
          merchantName: data.merchantName || '',
          qrCodeUrl: data.qrCodeUrl || ''
        });
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoadingSettings(false);
    }
  }, [isAdmin]);

  // Save a single setting
  const handleSaveSetting = async (key) => {
    const value = settingsEditing[key];
    if (!value || !value.trim()) {
      showToast('Value cannot be empty', 'error');
      return;
    }
    setSavingSettingKey(key);
    try {
      const res = await adminService.updateSetting(key, value.trim());
      if (res?.success) {
        showToast(`${key === 'upiId' ? 'UPI ID' : key === 'merchantName' ? 'Merchant Name' : 'QR Code URL'} updated successfully!`, 'success');
        fetchSettings();
      }
    } catch (err) {
      showToast(getErrorMessage(err, `Failed to update ${key}`), 'error');
    } finally {
      setSavingSettingKey(null);
    }
  };

  // Fetch Plans
  const fetchPlans = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingPlans(true);
    try {
      const res = await adminService.getPlans();
      if (res?.success) {
        setPlansList(res.data || []);
      }
    } catch (e) {
      console.error('Error fetching plans:', e);
    } finally {
      setLoadingPlans(false);
    }
  }, [isAdmin]);

  // Reset plan form
  const resetPlanForm = () => {
    setPlanForm({
      name: '', investmentAmount: '', dailyEarning: '', durationDays: '',
      badge: 'STARTER', popular: false, color: 'emerald', features: '', description: ''
    });
    setEditingPlan(null);
    setShowPlanForm(false);
  };

  // Open edit plan form
  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      investmentAmount: plan.investmentAmount || '',
      dailyEarning: plan.dailyEarning || '',
      durationDays: plan.durationDays || '',
      badge: plan.badge || 'STARTER',
      popular: plan.popular || false,
      color: plan.color || 'emerald',
      features: (plan.features || []).join(', '),
      description: plan.description || ''
    });
    setShowPlanForm(true);
  };

  // Create or Update Plan
  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name || !planForm.investmentAmount || !planForm.dailyEarning || !planForm.durationDays) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSavingPlan(true);
    try {
      const payload = {
        name: planForm.name.trim(),
        investmentAmount: Number(planForm.investmentAmount),
        dailyEarning: Number(planForm.dailyEarning),
        durationDays: Number(planForm.durationDays),
        badge: planForm.badge || 'STARTER',
        popular: planForm.popular,
        color: planForm.color || 'emerald',
        features: planForm.features ? planForm.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        description: planForm.description.trim()
      };

      let res;
      if (editingPlan) {
        res = await adminService.updatePlan(editingPlan._id || editingPlan.id, payload);
      } else {
        res = await adminService.createPlan(payload);
      }

      if (res?.success) {
        showToast(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!', 'success');
        resetPlanForm();
        fetchPlans();
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save plan'), 'error');
    } finally {
      setSavingPlan(false);
    }
  };

  // Delete Plan
  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan? This cannot be undone.')) return;
    setDeletingPlanId(planId);
    try {
      const res = await adminService.deletePlan(planId);
      if (res?.success) {
        showToast('Plan deleted successfully!', 'success');
        fetchPlans();
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete plan'), 'error');
    } finally {
      setDeletingPlanId(null);
    }
  };

  // Initial Load on Admin tab switch
  useEffect(() => {
    if (isAdmin) {
      fetchAdminMetrics();
      fetchDeposits();
      fetchWithdrawals();
      fetchUsers();
      fetchPlans();
      fetchSettings();
    }
  }, [isAdmin, fetchAdminMetrics, fetchDeposits, fetchWithdrawals, fetchUsers, fetchPlans, fetchSettings]);

  // Approve / Reject Deposit
  const handleDepositAction = async (id, status, utr) => {
    setActioningId(id);
    try {
      const res = await adminService.updateDepositStatus(id, status, utr);
      if (res?.success) {
        showToast(
          status === 'SUCCESS' ? 'Deposit Approved & Wallet Credited!' : 'Deposit Marked as Failed',
          status === 'SUCCESS' ? 'success' : 'info'
        );
        fetchDeposits();
        fetchAdminMetrics();
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to update deposit status'), 'error');
    } finally {
      setActioningId(null);
    }
  };

  // Approve / Reject Withdrawal
  const handleWithdrawalAction = async (id, status) => {
    setActioningId(id);
    try {
      const res = await adminService.updateWithdrawalStatus(id, status);
      if (res?.success) {
        showToast(
          status === 'completed' ? 'Withdrawal Approved & Settled!' : 'Withdrawal Rejected & Hold Released!',
          status === 'completed' ? 'success' : 'info'
        );
        fetchWithdrawals();
        fetchAdminMetrics();
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to update withdrawal status'), 'error');
    } finally {
      setActioningId(null);
    }
  };

  // Toggle User Status (active / suspended)
  const handleUserStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setActioningId(userId);
    try {
      const res = await adminService.updateUserStatus(userId, nextStatus);
      if (res?.success) {
        showToast(`User status updated to ${nextStatus.toUpperCase()}`, 'success');
        fetchUsers();
        fetchAdminMetrics();
      }
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to update user status'), 'error');
    } finally {
      setActioningId(null);
    }
  };

  // Status badge helper
  const StatusBadge = ({ status, type = 'deposit' }) => {
    let colorClass = '';
    if (type === 'deposit') {
      colorClass = status === 'SUCCESS'
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        : ['VERIFICATION_PENDING', 'PENDING'].includes(status)
        ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
        : 'bg-red-500/20 text-red-400 border-red-500/30';
    } else if (type === 'withdrawal') {
      colorClass = status === 'completed'
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        : status === 'pending'
        ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
        : 'bg-red-500/20 text-red-400 border-red-500/30';
    } else {
      colorClass = status === 'active'
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        : 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>
        {(status || 'UNKNOWN').toUpperCase().replace('_', ' ')}
      </span>
    );
  };

  // Render Admin Login Form if not logged in as Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#031C12] text-slate-100 flex items-center justify-center p-3 sm:p-4 antialiased">
        <div className="w-full max-w-md bg-[#0A261A] border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Accent */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F4D06F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#123A29] border border-amber-400/40 rounded-2xl flex items-center justify-center text-[#F4D06F] shadow-lg">
              <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">FINOVA ADMIN</h1>
              <p className="text-[10px] sm:text-xs text-[#A7B8AE] mt-1">Authorized Administration Desk</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] sm:text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Admin Mobile / Email
              </label>
              <input
                type="text"
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                placeholder="admin@finova.app"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#061F15] border border-emerald-500/20 rounded-xl sm:rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#061F15] border border-emerald-500/20 rounded-xl sm:rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl sm:rounded-2xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>

            {/* Quick Fill Button */}
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="w-full py-2 text-xs text-[#F4D06F] hover:underline flex items-center justify-center gap-1.5 font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Admin Credentials</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingDepositsCount = deposits.filter(d => ['PENDING', 'VERIFICATION_PENDING'].includes(d.status)).length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 px-1 sm:px-0">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 bg-[#0A261A] border border-emerald-500/30 rounded-2xl sm:rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#123A29] border border-amber-400/40 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#F4D06F] shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold text-white font-mono truncate">FINOVA ADMIN</h1>
              <span className="px-1.5 sm:px-2 py-0.5 bg-amber-400/20 border border-amber-400/40 text-[#F4D06F] rounded-md text-[9px] sm:text-[10px] font-bold whitespace-nowrap">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#A7B8AE] truncate">{user?.email || 'admin@finova.app'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('finova_token');
            setIsAuthenticated(false);
            setUser({ role: 'user' });
            showToast('Logged out of Admin Portal', 'info');
          }}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#061F15] hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer self-end sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-[#0A261A] border border-emerald-500/20 rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-semibold text-[#A7B8AE]">Total Users</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-white">
            {metrics?.totalUsers ?? usersList.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium">
            {metrics?.activeUsers ?? usersList.filter(u => u.status === 'active').length} Active
          </span>
        </div>

        <div className="p-3 sm:p-4 bg-[#0A261A] border border-emerald-500/20 rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-semibold text-[#A7B8AE]">Pending Dep.</span>
            <ArrowDownLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4D06F]" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-[#F4D06F]">
            {pendingDepositsCount}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-400 font-medium">Action Required</span>
        </div>

        <div className="p-3 sm:p-4 bg-[#0A261A] border border-emerald-500/20 rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-semibold text-[#A7B8AE]">Pending Wdr.</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-amber-400">
            {pendingWithdrawalsCount}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-400 font-medium">Action Required</span>
        </div>

        <div className="p-3 sm:p-4 bg-[#0A261A] border border-emerald-500/20 rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-semibold text-[#A7B8AE]">Volume</span>
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-white truncate">
            ₹{(metrics?.totalDeposits || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium">Total Deposits</span>
        </div>
      </div>

      {/* Navigation Tabs - Scrollable */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-emerald-500/20 pb-3 overflow-x-auto no-scrollbar -mx-1 px-1">
        {[
          { key: 'deposits', icon: ArrowDownLeft, label: 'Deposits', shortLabel: 'Deposits', badge: pendingDepositsCount },
          { key: 'withdrawals', icon: ArrowUpRight, label: 'Withdrawals', shortLabel: 'Withdraw', badge: pendingWithdrawalsCount },
          { key: 'users', icon: Users, label: 'Users', shortLabel: 'Users', badge: 0 },
          { key: 'plans', icon: Briefcase, label: 'Investment Plans', shortLabel: 'Plans', badge: 0 },
          { key: 'settings', icon: Settings, label: 'Settings', shortLabel: 'Settings', badge: 0 }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === tab.key
                ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md'
                : 'bg-[#0A261A] text-[#A7B8AE] border border-emerald-500/16 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            {tab.badge > 0 && (
              <span className="px-1.5 sm:px-2 py-0.5 bg-amber-400 text-slate-950 font-mono font-bold rounded-full text-[9px] sm:text-[10px]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Tab 1: Deposit Management                         */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'deposits' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4D06F]" />
                <span className="hidden sm:inline">Deposit Requests Management</span>
                <span className="sm:hidden">Deposits</span>
              </h2>
              <button
                onClick={fetchDeposits}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl sm:hidden"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
              {['ALL', 'VERIFICATION_PENDING', 'PENDING', 'SUCCESS', 'FAILED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setDepositFilter(st)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    depositFilter === st
                      ? 'bg-[#123A29] text-[#F4D06F] border border-amber-400/40'
                      : 'bg-[#061F15] text-[#A7B8AE] hover:text-white'
                  }`}
                >
                  {st === 'VERIFICATION_PENDING' ? 'V. PENDING' : st.replace('_', ' ')}
                </button>
              ))}
              <button
                onClick={fetchDeposits}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl shrink-0 hidden sm:block"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-emerald-500/16">
            <table className="w-full text-left text-xs text-[#A7B8AE]">
              <thead className="bg-[#061F15] text-[10px] uppercase font-semibold text-[#F4D06F]">
                <tr>
                  <th className="p-3">User Details</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Ref / UTR</th>
                  <th className="p-3">Proof Screenshot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {loadingDeposits ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs">
                      Loading deposit requests...
                    </td>
                  </tr>
                ) : deposits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs">
                      No deposit requests found.
                    </td>
                  </tr>
                ) : (
                  deposits.map((d) => (
                    <tr key={d._id || d.id} className="hover:bg-[#061F15]/60 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{d.user?.name || 'Investor'}</div>
                        <div className="text-[10px] text-[#A7B8AE]">{d.user?.phone || d.user?.email}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#F4D06F]">
                        ₹{d.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 font-mono">
                        <div className="text-white text-[11px]">{d.paymentReference}</div>
                        {d.utr ? (
                          <div className="text-emerald-400 text-[10px]">UTR: {d.utr}</div>
                        ) : (
                          <div className="text-gray-500 text-[10px]">No UTR provided</div>
                        )}
                      </td>
                      <td className="p-3">
                        {d.paymentScreenshot ? (
                          <button
                            onClick={() => setPreviewImage(d.paymentScreenshot)}
                            className="px-2.5 py-1 bg-[#123A29] hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <FileImage className="w-3.5 h-3.5 text-[#F4D06F]" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-gray-500 text-[10px]">No Screenshot</span>
                        )}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={d.status} type="deposit" />
                      </td>
                      <td className="p-3 text-right">
                        {['PENDING', 'VERIFICATION_PENDING'].includes(d.status) ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={actioningId === (d._id || d.id)}
                              onClick={() => handleDepositAction(d._id || d.id, 'SUCCESS', d.utr)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={actioningId === (d._id || d.id)}
                              onClick={() => handleDepositAction(d._id || d.id, 'FAILED')}
                              className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (visible on mobile, hidden on lg+) */}
          <div className="lg:hidden space-y-3">
            {loadingDeposits ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">Loading deposit requests...</div>
            ) : deposits.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">No deposit requests found.</div>
            ) : (
              deposits.map((d) => (
                <div key={d._id || d.id} className="bg-[#061F15] border border-emerald-500/16 rounded-xl p-3.5 space-y-2.5">
                  {/* Top Row: User + Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{d.user?.name || 'Investor'}</div>
                      <div className="text-[10px] text-[#A7B8AE] truncate">{d.user?.phone || d.user?.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-[#F4D06F] text-sm">₹{d.amount?.toLocaleString('en-IN')}</div>
                      <StatusBadge status={d.status} type="deposit" />
                    </div>
                  </div>

                  {/* Ref / UTR */}
                  <div className="text-[10px] font-mono text-[#A7B8AE] bg-[#0A261A] rounded-lg px-2.5 py-1.5 truncate">
                    <span className="text-white">{d.paymentReference}</span>
                    {d.utr && <span className="text-emerald-400 ml-2">UTR: {d.utr}</span>}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {d.paymentScreenshot ? (
                      <button
                        onClick={() => setPreviewImage(d.paymentScreenshot)}
                        className="px-2.5 py-1.5 bg-[#123A29] hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FileImage className="w-3 h-3 text-[#F4D06F]" />
                        <span>View Proof</span>
                      </button>
                    ) : (
                      <span className="text-gray-500 text-[10px]">No Screenshot</span>
                    )}

                    {['PENDING', 'VERIFICATION_PENDING'].includes(d.status) ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={actioningId === (d._id || d.id)}
                          onClick={() => handleDepositAction(d._id || d.id, 'SUCCESS', d.utr)}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          disabled={actioningId === (d._id || d.id)}
                          onClick={() => handleDepositAction(d._id || d.id, 'FAILED')}
                          className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-medium">Processed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* Tab 2: Withdrawal Management                      */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'withdrawals' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="hidden sm:inline">Withdrawal Requests Approval</span>
                <span className="sm:hidden">Withdrawals</span>
              </h2>
              <button
                onClick={fetchWithdrawals}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl sm:hidden"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
              {['ALL', 'pending', 'completed', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setWithdrawalFilter(st)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    withdrawalFilter === st
                      ? 'bg-[#123A29] text-[#F4D06F] border border-amber-400/40'
                      : 'bg-[#061F15] text-[#A7B8AE] hover:text-white'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
              <button
                onClick={fetchWithdrawals}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl shrink-0 hidden sm:block"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-emerald-500/16">
            <table className="w-full text-left text-xs text-[#A7B8AE]">
              <thead className="bg-[#061F15] text-[10px] uppercase font-semibold text-[#F4D06F]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {loadingWithdrawals ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-xs">Loading withdrawal requests...</td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-xs">No withdrawal requests found.</td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w._id || w.id} className="hover:bg-[#061F15]/60 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{w.user?.name || 'User'}</div>
                        <div className="text-[10px] text-[#A7B8AE]">{w.user?.phone || w.user?.email}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-400">
                        ₹{w.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <div className="text-white font-medium">{w.bankAccount?.bankName || 'Bank'}</div>
                        <div className="text-[10px] text-emerald-400">A/C: {w.bankAccount?.accountNumberEncrypted ? `****${w.bankAccount.accountNumberLast4 || '4521'}` : 'Verified'}</div>
                        <div className="text-[10px] text-[#A7B8AE]">IFSC: {w.bankAccount?.ifsc || 'HDFC0001'}</div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={w.status} type="withdrawal" />
                      </td>
                      <td className="p-3 text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={actioningId === (w._id || w.id)}
                              onClick={() => handleWithdrawalAction(w._id || w.id, 'completed')}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={actioningId === (w._id || w.id)}
                              onClick={() => handleWithdrawalAction(w._id || w.id, 'rejected')}
                              className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {loadingWithdrawals ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">Loading withdrawal requests...</div>
            ) : withdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">No withdrawal requests found.</div>
            ) : (
              withdrawals.map((w) => (
                <div key={w._id || w.id} className="bg-[#061F15] border border-emerald-500/16 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{w.user?.name || 'User'}</div>
                      <div className="text-[10px] text-[#A7B8AE] truncate">{w.user?.phone || w.user?.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-amber-400 text-sm">₹{w.amount?.toLocaleString('en-IN')}</div>
                      <StatusBadge status={w.status} type="withdrawal" />
                    </div>
                  </div>

                  <div className="text-[10px] bg-[#0A261A] rounded-lg px-2.5 py-1.5 space-y-0.5">
                    <div className="text-white font-medium">{w.bankAccount?.bankName || 'Bank'}</div>
                    <div className="text-emerald-400">A/C: {w.bankAccount?.accountNumberEncrypted ? `****${w.bankAccount.accountNumberLast4 || '4521'}` : 'Verified'}</div>
                    <div className="text-[#A7B8AE]">IFSC: {w.bankAccount?.ifsc || 'HDFC0001'}</div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    {w.status === 'pending' ? (
                      <>
                        <button
                          disabled={actioningId === (w._id || w.id)}
                          onClick={() => handleWithdrawalAction(w._id || w.id, 'completed')}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          disabled={actioningId === (w._id || w.id)}
                          onClick={() => handleWithdrawalAction(w._id || w.id, 'rejected')}
                          className="px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-medium">Completed</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* Tab 3: User Management                            */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                <span className="hidden sm:inline">User Directory & Status</span>
                <span className="sm:hidden">Users</span>
              </h2>
              <button
                onClick={fetchUsers}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl sm:hidden"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7B8AE]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search Name / Email / Phone"
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-[#061F15] border border-emerald-500/20 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl shrink-0 hidden sm:block"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-emerald-500/16">
            <table className="w-full text-left text-xs text-[#A7B8AE]">
              <thead className="bg-[#061F15] text-[10px] uppercase font-semibold text-[#F4D06F]">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Available Balance</th>
                  <th className="p-3">Total Invested</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs">Loading user directory...</td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs">No users found.</td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u._id || u.id} className="hover:bg-[#061F15]/60 transition-colors">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{u.email}</div>
                        <div className="text-[10px] text-[#A7B8AE]">{u.phone}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#F4D06F]">
                        ₹{(u.wallet?.availableBalance || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 font-mono text-emerald-400">
                        ₹{(u.wallet?.totalInvested || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={u.status || 'active'} type="user" />
                      </td>
                      <td className="p-3 text-right">
                        <button
                          disabled={actioningId === (u._id || u.id)}
                          onClick={() => handleUserStatusToggle(u._id || u.id, u.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            u.status === 'active'
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {loadingUsers ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">Loading user directory...</div>
            ) : usersList.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">No users found.</div>
            ) : (
              usersList.map((u) => (
                <div key={u._id || u.id} className="bg-[#061F15] border border-emerald-500/16 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{u.name}</div>
                      <div className="text-[10px] text-[#A7B8AE] truncate">{u.email}</div>
                      <div className="text-[10px] text-[#A7B8AE]">{u.phone}</div>
                    </div>
                    <StatusBadge status={u.status || 'active'} type="user" />
                  </div>

                  <div className="flex items-center gap-3 text-[10px] bg-[#0A261A] rounded-lg px-2.5 py-2">
                    <div>
                      <span className="text-[#A7B8AE]">Balance: </span>
                      <span className="font-mono font-bold text-[#F4D06F]">₹{(u.wallet?.availableBalance || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-px h-3 bg-emerald-500/20" />
                    <div>
                      <span className="text-[#A7B8AE]">Invested: </span>
                      <span className="font-mono font-bold text-emerald-400">₹{(u.wallet?.totalInvested || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      disabled={actioningId === (u._id || u.id)}
                      onClick={() => handleUserStatusToggle(u._id || u.id, u.status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend User' : 'Activate User'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* Tab 4: Plans Management                            */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'plans' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4D06F]" />
              <span className="hidden sm:inline">Investment Plans Management</span>
              <span className="sm:hidden">Plans</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { resetPlanForm(); setShowPlanForm(true); }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Plan</span>
              </button>
              <button
                onClick={fetchPlans}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl border border-emerald-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${loadingPlans ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Add/Edit Plan Form */}
          {showPlanForm && (
            <div className="p-4 sm:p-5 bg-[#061F15] border border-emerald-500/20 rounded-xl sm:rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-[#F4D06F] font-mono flex items-center gap-2">
                  {editingPlan ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</span>
                </h3>
                <button onClick={resetPlanForm} className="p-1 text-[#A7B8AE] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Plan Name *</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Gold Plan"
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Investment Amount (₹) *</label>
                    <input
                      type="number"
                      value={planForm.investmentAmount}
                      onChange={(e) => setPlanForm(p => ({ ...p, investmentAmount: e.target.value }))}
                      placeholder="5000"
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Daily Earning (₹) *</label>
                    <input
                      type="number"
                      value={planForm.dailyEarning}
                      onChange={(e) => setPlanForm(p => ({ ...p, dailyEarning: e.target.value }))}
                      placeholder="100"
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Duration (Days) *</label>
                    <input
                      type="number"
                      value={planForm.durationDays}
                      onChange={(e) => setPlanForm(p => ({ ...p, durationDays: e.target.value }))}
                      placeholder="30"
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Badge</label>
                    <select
                      value={planForm.badge}
                      onChange={(e) => setPlanForm(p => ({ ...p, badge: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    >
                      {['STARTER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ELITE', 'VIP'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Color Theme</label>
                    <select
                      value={planForm.color}
                      onChange={(e) => setPlanForm(p => ({ ...p, color: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    >
                      {['emerald', 'amber', 'rose', 'violet', 'blue', 'cyan', 'orange', 'pink'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={planForm.features}
                    onChange={(e) => setPlanForm(p => ({ ...p, features: e.target.value }))}
                    placeholder="Daily Returns, Capital Safety, 24/7 Support"
                    className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#A7B8AE] uppercase mb-1">Description</label>
                  <textarea
                    value={planForm.description}
                    onChange={(e) => setPlanForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief plan description..."
                    rows={2}
                    className="w-full px-3 py-2 bg-[#0A261A] border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.popular}
                      onChange={(e) => setPlanForm(p => ({ ...p, popular: e.target.checked }))}
                      className="w-3.5 h-3.5 accent-emerald-500"
                    />
                    <span className="text-[11px] text-[#A7B8AE] font-medium">Mark as Popular</span>
                  </label>
                </div>

                {/* Auto-calculated Preview */}
                {planForm.investmentAmount && planForm.dailyEarning && planForm.durationDays && (
                  <div className="p-3 bg-[#0A261A] rounded-lg border border-emerald-500/16 text-[10px] text-[#A7B8AE] space-y-1">
                    <p className="font-semibold text-[#F4D06F] text-[11px]">Preview Calculations:</p>
                    <p>Scheduled Earnings: <span className="text-emerald-400 font-mono font-bold">₹{(Number(planForm.dailyEarning) * Number(planForm.durationDays)).toLocaleString('en-IN')}</span></p>
                    <p>ROI: <span className="text-emerald-400 font-mono font-bold">{Math.round((Number(planForm.dailyEarning) * Number(planForm.durationDays) / Number(planForm.investmentAmount)) * 100)}%</span></p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={resetPlanForm}
                    className="px-4 py-2 bg-[#0A261A] text-[#A7B8AE] hover:text-white rounded-lg text-xs font-semibold border border-emerald-500/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPlan}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-900/30 disabled:opacity-50"
                  >
                    {savingPlan ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingPlan ? 'Update Plan' : 'Create Plan'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-emerald-500/16">
            <table className="w-full text-left text-xs text-[#A7B8AE]">
              <thead className="bg-[#061F15] text-[10px] uppercase font-semibold text-[#F4D06F]">
                <tr>
                  <th className="p-3">Plan Name</th>
                  <th className="p-3">Investment</th>
                  <th className="p-3">Daily Earning</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Total ROI</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {loadingPlans ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-xs">Loading plans...</td>
                  </tr>
                ) : plansList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-xs">No investment plans found. Create one!</td>
                  </tr>
                ) : (
                  plansList.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-[#061F15]/60 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {p.name}
                          {p.popular && <Sparkles className="w-3 h-3 text-[#F4D06F]" />}
                        </div>
                        {p.description && <div className="text-[10px] text-[#A7B8AE] truncate max-w-[200px]">{p.description}</div>}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#F4D06F]">₹{p.investmentAmount?.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono text-emerald-400">₹{p.dailyEarning?.toLocaleString('en-IN')}/day</td>
                      <td className="p-3 font-mono text-white">{p.durationDays} days</td>
                      <td className="p-3">
                        <div className="font-mono text-emerald-400">₹{p.scheduledEarnings?.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-amber-400">{p.roi}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400/30 text-[#F4D06F] rounded-md text-[10px] font-bold">
                          {p.badge}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {(p.status || 'active').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditPlan(p)}
                            className="px-2.5 py-1.5 bg-[#123A29] hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            disabled={deletingPlanId === (p._id || p.id)}
                            onClick={() => handleDeletePlan(p._id || p.id)}
                            className="px-2.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {deletingPlanId === (p._id || p.id) ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {loadingPlans ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">Loading plans...</div>
            ) : plansList.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#A7B8AE]">No investment plans found. Create one!</div>
            ) : (
              plansList.map((p) => (
                <div key={p._id || p.id} className="bg-[#061F15] border border-emerald-500/16 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        {p.name}
                        {p.popular && <Sparkles className="w-3 h-3 text-[#F4D06F]" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-amber-400/20 border border-amber-400/30 text-[#F4D06F] rounded text-[9px] font-bold">{p.badge}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>{(p.status || 'active').toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-[#F4D06F] text-sm">₹{p.investmentAmount?.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-amber-400 font-mono">{p.roi}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] bg-[#0A261A] rounded-lg px-2.5 py-2">
                    <div>
                      <span className="text-[#A7B8AE]">Daily</span>
                      <div className="font-mono font-bold text-emerald-400">₹{p.dailyEarning?.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-[#A7B8AE]">Duration</span>
                      <div className="font-mono font-bold text-white">{p.durationDays}d</div>
                    </div>
                    <div>
                      <span className="text-[#A7B8AE]">Total</span>
                      <div className="font-mono font-bold text-emerald-400">₹{p.scheduledEarnings?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {p.description && (
                    <p className="text-[10px] text-[#A7B8AE] leading-snug">{p.description}</p>
                  )}

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => openEditPlan(p)}
                      className="px-2.5 py-1.5 bg-[#123A29] hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      disabled={deletingPlanId === (p._id || p.id)}
                      onClick={() => handleDeletePlan(p._id || p.id)}
                      className="px-2.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {deletingPlanId === (p._id || p.id) ? (
                        <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* Tab 5: Platform Settings                          */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm sm:text-base font-bold text-white font-mono flex items-center gap-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4D06F]" />
              <span className="hidden sm:inline">Payment & QR Settings</span>
              <span className="sm:hidden">Settings</span>
            </h2>
            <button
              onClick={fetchSettings}
              className="p-1.5 sm:p-2 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-lg sm:rounded-xl border border-emerald-500/20 transition-all"
              title="Refresh Settings"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loadingSettings ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingSettings ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* UPI ID Setting */}
              <div className="p-3.5 sm:p-5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#123A29] border border-amber-400/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#F4D06F] text-xs sm:text-sm font-bold">₹</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white">UPI ID</h3>
                    <p className="text-[9px] sm:text-[10px] text-[#A7B8AE] leading-snug">UPI address shown to users during deposit</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.upiId}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="yourname@upi"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('upiId')}
                    disabled={savingSettingKey === 'upiId' || settingsEditing.upiId === settingsData.upiId}
                    className="px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                  >
                    {savingSettingKey === 'upiId' ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
                {settingsData.upiId && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="truncate">Current: {settingsData.upiId}</span>
                  </div>
                )}
              </div>

              {/* Merchant Name Setting */}
              <div className="p-3.5 sm:p-5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#123A29] border border-amber-400/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4D06F]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white">Merchant Name</h3>
                    <p className="text-[9px] sm:text-[10px] text-[#A7B8AE] leading-snug">Business name in UPI payment QR code</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.merchantName}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, merchantName: e.target.value }))}
                    placeholder="FINOVA"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('merchantName')}
                    disabled={savingSettingKey === 'merchantName' || settingsEditing.merchantName === settingsData.merchantName}
                    className="px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                  >
                    {savingSettingKey === 'merchantName' ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
                {settingsData.merchantName && (
                  <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="truncate">Current: {settingsData.merchantName}</span>
                  </div>
                )}
              </div>

              {/* Custom QR Code URL Setting */}
              <div className="p-3.5 sm:p-5 bg-[#061F15] border border-emerald-500/16 rounded-xl sm:rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#123A29] border border-amber-400/30 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4D06F]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white">Custom QR Code URL</h3>
                    <p className="text-[9px] sm:text-[10px] text-[#A7B8AE] leading-snug">Optional: Custom QR image overrides auto-generated QR</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.qrCodeUrl}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                    placeholder="https://example.com/your-qr.png"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-lg sm:rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('qrCodeUrl')}
                    disabled={savingSettingKey === 'qrCodeUrl' || settingsEditing.qrCodeUrl === (settingsData.qrCodeUrl || '')}
                    className="px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                  >
                    {savingSettingKey === 'qrCodeUrl' ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
                {settingsData.qrCodeUrl && (
                  <div className="space-y-2">
                    <div className="text-[9px] sm:text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="truncate">Current: {settingsData.qrCodeUrl}</span>
                    </div>
                    <div className="mt-2 p-2.5 sm:p-3 bg-[#0A261A] rounded-lg sm:rounded-xl border border-emerald-500/20 inline-block">
                      <p className="text-[9px] sm:text-[10px] text-[#A7B8AE] mb-2">Preview:</p>
                      <img
                        src={settingsData.qrCodeUrl}
                        alt="Custom QR Preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-emerald-500/30"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-3 sm:p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl sm:rounded-2xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4D06F] shrink-0 mt-0.5" />
                  <div className="text-[10px] sm:text-[11px] text-[#A7B8AE] space-y-1">
                    <p className="font-semibold text-[#F4D06F]">How Settings Work</p>
                    <p>• <strong>UPI ID</strong> — UPI address for deposit payments. New deposits use updated value immediately.</p>
                    <p>• <strong>Merchant Name</strong> — Appears in UPI payment request in user's app.</p>
                    <p>• <strong>Custom QR Code URL</strong> — Overrides auto-generated QR with custom image.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proof Screenshot Image Modal Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-[#0A261A] border border-emerald-500/40 rounded-2xl sm:rounded-3xl p-3 sm:p-4 max-w-lg w-full max-h-[85vh] flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-3 border-b border-emerald-500/20 pb-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F4D06F] flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Payment Proof
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 text-[#A7B8AE] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex-1 overflow-auto flex items-center justify-center p-1 sm:p-2">
              <img
                src={previewImage}
                alt="Payment Proof Full Preview"
                className="max-w-full max-h-[55vh] sm:max-h-[60vh] object-contain rounded-lg sm:rounded-xl border border-emerald-500/30"
              />
            </div>
            <div className="w-full pt-2 sm:pt-3 flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#123A29] text-[#F4D06F] rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
