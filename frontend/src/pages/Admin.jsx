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
  Settings
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

  // Initial Load on Admin tab switch
  useEffect(() => {
    if (isAdmin) {
      fetchAdminMetrics();
      fetchDeposits();
      fetchWithdrawals();
      fetchUsers();
      fetchSettings();
    }
  }, [isAdmin, fetchAdminMetrics, fetchDeposits, fetchWithdrawals, fetchUsers, fetchSettings]);

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

  // Render Admin Login Form if not logged in as Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#031C12] text-slate-100 flex items-center justify-center p-4 antialiased">
        <div className="w-full max-w-md bg-[#0A261A] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Accent */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F4D06F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-16 h-16 bg-[#123A29] border border-amber-400/40 rounded-2xl flex items-center justify-center text-[#F4D06F] shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">FINOVA ADMIN</h1>
              <p className="text-xs text-[#A7B8AE] mt-1">Authorized Administration Desk</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Admin Mobile / Email
              </label>
              <input
                type="text"
                value={adminIdentifier}
                onChange={(e) => setAdminIdentifier(e.target.value)}
                placeholder="admin@finova.app"
                className="w-full px-4 py-3 bg-[#061F15] border border-emerald-500/20 rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
                Admin Security Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#061F15] border border-emerald-500/20 rounded-2xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer"
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
    <div className="space-y-6 pb-12">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#0A261A] border border-emerald-500/30 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#123A29] border border-amber-400/40 rounded-2xl flex items-center justify-center text-[#F4D06F]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-mono">FINOVA ADMIN PORTAL</h1>
              <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400/40 text-[#F4D06F] rounded-md text-[10px] font-bold">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-[#A7B8AE]">Logged in as {user?.email || 'admin@finova.app'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('finova_token');
            setIsAuthenticated(false);
            setUser({ role: 'user' });
            showToast('Logged out of Admin Portal', 'info');
          }}
          className="px-4 py-2 bg-[#061F15] hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0A261A] border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A7B8AE]">Total Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics?.totalUsers ?? usersList.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">
            {metrics?.activeUsers ?? usersList.filter(u => u.status === 'active').length} Active
          </span>
        </div>

        <div className="p-4 bg-[#0A261A] border border-emerald-500/20 rounded-2xl relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A7B8AE]">Pending Deposits</span>
            <ArrowDownLeft className="w-4 h-4 text-[#F4D06F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F4D06F]">
            {pendingDepositsCount}
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Action Required</span>
        </div>

        <div className="p-4 bg-[#0A261A] border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A7B8AE]">Pending Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {pendingWithdrawalsCount}
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Action Required</span>
        </div>

        <div className="p-4 bg-[#0A261A] border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A7B8AE]">Platform Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ₹{(metrics?.totalDeposits || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Total Verified Deposits</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md'
              : 'bg-[#0A261A] text-[#A7B8AE] border border-emerald-500/16 hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Deposits Approval</span>
          {pendingDepositsCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-mono font-bold rounded-full text-[10px]">
              {pendingDepositsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md'
              : 'bg-[#0A261A] text-[#A7B8AE] border border-emerald-500/16 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdrawals Approval</span>
          {pendingWithdrawalsCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-mono font-bold rounded-full text-[10px]">
              {pendingWithdrawalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md'
              : 'bg-[#0A261A] text-[#A7B8AE] border border-emerald-500/16 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#123A29] text-[#F4D06F] border border-[#F4D06F]/50 shadow-md'
              : 'bg-[#0A261A] text-[#A7B8AE] border border-emerald-500/16 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Platform Settings</span>
        </button>
      </div>

      {/* Tab 1: Deposit Management */}
      {activeTab === 'deposits' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-[#F4D06F]" />
              <span>Deposit Requests Management</span>
            </h2>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {['ALL', 'VERIFICATION_PENDING', 'PENDING', 'SUCCESS', 'FAILED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setDepositFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    depositFilter === st
                      ? 'bg-[#123A29] text-[#F4D06F] border border-amber-400/40'
                      : 'bg-[#061F15] text-[#A7B8AE] hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
              <button
                onClick={fetchDeposits}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-emerald-500/16">
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            d.status === 'SUCCESS'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : d.status === 'VERIFICATION_PENDING' || d.status === 'PENDING'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {d.status}
                        </span>
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
        </div>
      )}

      {/* Tab 2: Withdrawal Management */}
      {activeTab === 'withdrawals' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-amber-400" />
              <span>Withdrawal Requests Approval</span>
            </h2>

            <div className="flex items-center gap-2">
              {['ALL', 'pending', 'completed', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setWithdrawalFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-emerald-500/16">
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
                    <td colSpan="5" className="p-8 text-center text-xs">
                      Loading withdrawal requests...
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-xs">
                      No withdrawal requests found.
                    </td>
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            w.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : w.status === 'pending'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {w.status.toUpperCase()}
                        </span>
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
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>User Directory & Status Management</span>
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7B8AE]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search Name / Email / Phone"
                  className="w-full pl-9 pr-3 py-1.5 bg-[#061F15] border border-emerald-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-1.5 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-emerald-500/16">
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
                    <td colSpan="6" className="p-8 text-center text-xs">
                      Loading user directory...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-xs">
                      No users found.
                    </td>
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
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {u.status?.toUpperCase() || 'ACTIVE'}
                        </span>
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
        </div>
      )}

      {/* Tab 4: Platform Settings */}
      {activeTab === 'settings' && (
        <div className="bg-[#0A261A] border border-emerald-500/20 rounded-3xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#F4D06F]" />
              <span>Payment & QR Settings</span>
            </h2>
            <button
              onClick={fetchSettings}
              className="p-2 bg-[#061F15] text-[#A7B8AE] hover:text-[#F4D06F] rounded-xl border border-emerald-500/20 transition-all"
              title="Refresh Settings"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSettings ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingSettings ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* UPI ID Setting */}
              <div className="p-5 bg-[#061F15] border border-emerald-500/16 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-[#123A29] border border-amber-400/30 rounded-xl flex items-center justify-center">
                    <span className="text-[#F4D06F] text-sm font-bold">₹</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">UPI ID</h3>
                    <p className="text-[10px] text-[#A7B8AE]">The UPI address shown to users during deposit. Changes take effect immediately for new deposits.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.upiId}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="yourname@upi"
                    className="flex-1 px-4 py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('upiId')}
                    disabled={savingSettingKey === 'upiId' || settingsEditing.upiId === settingsData.upiId}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
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
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Current: {settingsData.upiId}</span>
                  </div>
                )}
              </div>

              {/* Merchant Name Setting */}
              <div className="p-5 bg-[#061F15] border border-emerald-500/16 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-[#123A29] border border-amber-400/30 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#F4D06F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Merchant Name</h3>
                    <p className="text-[10px] text-[#A7B8AE]">The merchant/business name embedded in the UPI payment QR code.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.merchantName}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, merchantName: e.target.value }))}
                    placeholder="FINOVA"
                    className="flex-1 px-4 py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('merchantName')}
                    disabled={savingSettingKey === 'merchantName' || settingsEditing.merchantName === settingsData.merchantName}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
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
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Current: {settingsData.merchantName}</span>
                  </div>
                )}
              </div>

              {/* Custom QR Code URL Setting */}
              <div className="p-5 bg-[#061F15] border border-emerald-500/16 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-[#123A29] border border-amber-400/30 rounded-xl flex items-center justify-center">
                    <FileImage className="w-4 h-4 text-[#F4D06F]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Custom QR Code Image URL</h3>
                    <p className="text-[10px] text-[#A7B8AE]">Optional: Provide a URL to a custom QR code image. If set, this overrides auto-generated QR.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settingsEditing.qrCodeUrl}
                    onChange={(e) => setSettingsEditing(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                    placeholder="https://example.com/your-qr-code.png"
                    className="flex-1 px-4 py-2.5 bg-[#0A261A] border border-emerald-500/20 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSaveSetting('qrCodeUrl')}
                    disabled={savingSettingKey === 'qrCodeUrl' || settingsEditing.qrCodeUrl === (settingsData.qrCodeUrl || '')}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
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
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Current: {settingsData.qrCodeUrl}</span>
                    </div>
                    <div className="mt-2 p-3 bg-[#0A261A] rounded-xl border border-emerald-500/20 inline-block">
                      <p className="text-[10px] text-[#A7B8AE] mb-2">Preview:</p>
                      <img
                        src={settingsData.qrCodeUrl}
                        alt="Custom QR Preview"
                        className="w-32 h-32 object-contain rounded-lg border border-emerald-500/30"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-amber-400/5 border border-amber-400/20 rounded-2xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F4D06F] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#A7B8AE] space-y-1">
                    <p className="font-semibold text-[#F4D06F]">How Settings Work</p>
                    <p>• <strong>UPI ID</strong> — This is the UPI address where users will send deposit payments. All new deposits will immediately use the updated value.</p>
                    <p>• <strong>Merchant Name</strong> — Appears in the UPI payment request shown to users in their UPI app.</p>
                    <p>• <strong>Custom QR Code URL</strong> — If provided, the custom QR image will be displayed to users instead of the auto-generated QR code.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proof Screenshot Image Modal Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#0A261A] border border-emerald-500/40 rounded-3xl p-4 max-w-lg w-full max-h-[85vh] flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-3 border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-mono font-bold text-[#F4D06F] flex items-center gap-1.5">
                <FileImage className="w-4 h-4" /> Payment Proof Screenshot
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 text-[#A7B8AE] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2">
              <img
                src={previewImage}
                alt="Payment Proof Full Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-xl border border-emerald-500/30"
              />
            </div>
            <div className="w-full pt-3 flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-[#123A29] text-[#F4D06F] rounded-xl text-xs font-bold"
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
