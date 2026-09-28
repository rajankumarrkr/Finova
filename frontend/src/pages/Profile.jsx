import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { formatCurrency } from '../utils/formatters';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  History,
  TrendingUp,
  Building2,
  CreditCard,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Edit3,
  Calendar,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const Profile = () => {
  const { user, setUser, setIsSupportOpen, showToast } = useApp();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: editName,
      phone: editPhone
    }));
    showToast('Profile updated successfully!', 'success');
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    showToast('Signed out from current session', 'info');
  };

  const menuRows = [
    {
      title: "Investment History",
      subtitle: "Detailed log of all active and completed plans",
      icon: TrendingUp,
      action: () => navigate('/history?tab=investments')
    },
    {
      title: "Earnings History",
      subtitle: "Daily return credits and dividend payouts",
      icon: History,
      action: () => navigate('/history?tab=earnings')
    },
    {
      title: "Bank Account & Payouts",
      subtitle: "Manage linked bank accounts for IMPS withdrawal",
      icon: Building2,
      action: () => navigate('/bank-account')
    },
    {
      title: "Notifications Preferences",
      subtitle: "Manage alerts, email digests, and SMS updates",
      icon: Bell,
      action: () => navigate('/notifications')
    },
    {
      title: "Security & PIN Code",
      subtitle: "Two-factor authentication and withdrawal PIN",
      icon: Lock,
      action: () => setIsSecurityModalOpen(true)
    },
    {
      title: "Help & Support Desk",
      subtitle: "24/7 dedicated investor relationship team",
      icon: HelpCircle,
      action: () => setIsSupportOpen(true)
    },
    {
      title: "Terms & Platform Rules",
      subtitle: "Review compliance rules and terms of service",
      icon: FileText,
      action: () => setIsTermsModalOpen(true)
    }
  ];

  return (
    <div className="space-y-6">
      {/* TOP PROFILE HEADER CARD */}
      <Card gradient gradientColor="emerald" className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-emerald-500 text-slate-950 rounded-full shadow-lg" title="KYC Verified">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-white font-sans">{user.name}</h2>
                <Badge variant="emerald" size="sm" dot>
                  {user.kycStatus} Investor
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-1 flex items-center justify-center sm:justify-start gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {user.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Member since {user.memberSince}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="glass"
            size="md"
            icon={Edit3}
            onClick={() => setIsEditModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* FINANCIAL STATISTICS */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Financial Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Lifetime Investment"
            value={formatCurrency(user.stats.lifetimeInvested)}
            subtitle="Across all plan tiers"
            icon={TrendingUp}
            iconColor="text-emerald-400"
          />

          <StatCard
            title="Total Lifetime Earnings"
            value={formatCurrency(user.balances.totalEarnings + 2600)}
            subtitle="Daily return + Referral bonus"
            icon={Zap}
            iconColor="text-blue-400"
          />

          <StatCard
            title="Referral Earnings"
            value={formatCurrency(user.balances.referralEarnings)}
            subtitle="10% network commission"
            icon={User}
            iconColor="text-purple-400"
          />

          <StatCard
            title="Withdrawable Balance"
            value={formatCurrency(user.balances.withdrawableBalance)}
            subtitle="Instant payout ready"
            icon={Building2}
            iconColor="text-amber-400"
            highlight={true}
          />
        </div>
      </div>

      {/* INVESTMENT SUMMARY */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-slate-300">Investment Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Active Investments</span>
            <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {user.stats.activeInvestmentsCount}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Completed Plans</span>
            <span className="text-xl md:text-2xl font-black text-blue-400 font-mono mt-1 block">
              {user.stats.completedPlansCount}
            </span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Total Invested</span>
            <span className="text-xl md:text-2xl font-black text-white font-mono mt-1 block">
              {formatCurrency(user.stats.lifetimeInvested)}
            </span>
          </div>
        </div>
      </Card>

      {/* PROFILE MENU ROWS */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account Settings & Menu</h3>
        <div className="space-y-2">
          {menuRows.map((menu, idx) => (
            <div
              key={idx}
              onClick={menu.action}
              className="flex items-center justify-between p-4 rounded-2xl glass-panel-interactive border-slate-800/80 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                  <menu.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-sans group-hover:text-emerald-300 transition-colors">{menu.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{menu.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors" />
            </div>
          ))}

          {/* Logout row */}
          <div
            onClick={handleLogout}
            className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-pointer hover:bg-rose-500/20 transition-all mt-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Logout Account</h4>
                <p className="text-xs text-rose-300/70">Safely sign out from this device</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        subtitle="Update your personal details"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Phone Number</label>
            <input
              type="text"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth>Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* SECURITY MODAL */}
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="Security Settings"
        subtitle="Protect your wallet and account"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-white text-sm">Two-Factor Authentication (2FA)</h5>
              <p className="text-slate-400 mt-0.5">Require OTP for withdrawals</p>
            </div>
            <Badge variant="emerald" size="sm">ENABLED</Badge>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-white text-sm">Withdrawal Security PIN</h5>
              <p className="text-slate-400 mt-0.5">4-digit PIN for IMPS transfers</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => { showToast('PIN reset link sent to email', 'info'); setIsSecurityModalOpen(false); }}>Reset PIN</Button>
          </div>

          <Button variant="secondary" fullWidth onClick={() => setIsSecurityModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      {/* TERMS MODAL */}
      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms & Rules"
        subtitle="Finova Platform Rules"
      >
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto pr-2">
          <p><strong>1. Automated Returns:</strong> Daily earnings are calculated based on the designated percentage of your active plan configuration.</p>
          <p><strong>2. Withdrawals:</strong> Instant IMPS processing to linked verified Indian bank accounts only.</p>
          <p><strong>3. Referral Policy:</strong> 10% commission is credited upon valid plan activation by invited team members.</p>
        </div>
        <div className="pt-4">
          <Button variant="secondary" fullWidth onClick={() => setIsTermsModalOpen(false)}>Close Terms</Button>
        </div>
      </Modal>
    </div>
  );
};
