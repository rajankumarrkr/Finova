import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { PortfolioChart } from '../components/charts/PortfolioChart';
import { ActiveInvestmentCard } from '../components/cards/ActiveInvestmentCard';
import { TransactionItem } from '../components/cards/TransactionItem';
import { formatCurrency } from '../utils/formatters';

import {
  ArrowDownLeft,
  Zap,
  ArrowUpRight,
  History,
  Building2,
  Users,
  Sparkles,
  Wallet,
  PiggyBank,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const Home = () => {
  const {
    user,
    activeInvestments,
    transactions,
    setIsDepositOpen,
    setIsWithdrawOpen,
    openInvestModal
  } = useApp();
  const navigate = useNavigate();

  const balances = user.balances;
  const recentTxns = transactions.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* LUXURY BANNER */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[#F4D06F] text-xs font-bold font-mono tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Build Your Wealth • Grow Your Future
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">
              Welcome back, <span className="gold-text-gradient">{user?.name ? user.name.split(' ')[0] : 'Investor'}</span>
            </h2>
            <p className="text-xs md:text-sm text-[#A7B8AE] mt-1 max-w-xl font-sans">
              Real-time wealth management analytics and automated daily investment payouts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="gold"
              size="lg"
              icon={Zap}
              onClick={() => openInvestModal()}
            >
              Start Investing
            </Button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* FINANCIAL SUMMARY CARDS (FOUR CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Balance */}
        <StatCard
          title="Total Balance"
          value={formatCurrency(balances.totalBalance)}
          subtitle="All-time portfolio value"
          icon={Wallet}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
          valueColor="text-[#F4D06F]"
        />

        {/* 2. Today's Earning */}
        <StatCard
          title="Today's Earning"
          value={`+${formatCurrency(balances.todayEarnings)}`}
          subtitle="Automated daily return"
          icon={TrendingUp}
          iconColor="text-[#34D399]"
          iconBg="bg-emerald-500/15 border-emerald-500/30"
          valueColor="text-[#34D399]"
          trend="+100% payout"
          trendType="up"
        />

        {/* 3. Total Investment */}
        <StatCard
          title="Total Investment"
          value={formatCurrency(balances.totalInvested)}
          subtitle={`${activeInvestments.length} active plans`}
          icon={Zap}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
          valueColor="text-[#F8FAFC]"
        />

        {/* 4. Withdrawable Balance */}
        <StatCard
          title="Withdrawable Balance"
          value={formatCurrency(balances.withdrawableBalance || balances.availableBalance)}
          subtitle="Ready for instant payout"
          icon={PiggyBank}
          iconColor="text-[#34D399]"
          iconBg="bg-emerald-500/15 border-emerald-500/30"
          valueColor="text-[#34D399]"
        />
      </div>

      {/* QUICK ACTIONS (SIX ELEGANT BUTTONS) */}
      <div>
        <h3 className="text-xs font-bold text-[#71857A] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setIsDepositOpen(true)}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#34D399] mb-2 group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Add Funds</span>
          </button>

          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-amber-400/15 text-[#F4D06F] mb-2 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Withdraw</span>
          </button>

          <button
            onClick={() => openInvestModal()}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#34D399] mb-2 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Invest</span>
          </button>

          <button
            onClick={() => navigate('/bank-account')}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-amber-400/15 text-[#F4D06F] mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Bank Account</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#34D399] mb-2 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">History</span>
          </button>

          <button
            onClick={() => navigate('/team')}
            className="flex flex-col items-center justify-center p-3.5 rounded-[18px] bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/40 text-[#F8FAFC] transition-all duration-200 hover:-translate-y-0.5 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-amber-400/15 text-[#F4D06F] mb-2 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Refer & Earn</span>
          </button>
        </div>
      </div>

      {/* PORTFOLIO PERFORMANCE CHART */}
      <PortfolioChart />

      {/* ACTIVE INVESTMENT & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVE INVESTMENTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F8FAFC] font-sans">Active Investments</h3>
            <button
              onClick={() => navigate('/plans')}
              className="text-xs font-bold text-[#34D399] hover:text-[#F4D06F] flex items-center gap-0.5"
            >
              <span>Explore Plans</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {activeInvestments.length > 0 ? (
            <div className="space-y-4">
              {activeInvestments.map(inv => (
                <ActiveInvestmentCard
                  key={inv.id}
                  investment={inv}
                  onViewDetails={() => navigate('/plans')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-[#71857A]">
              <p>No active investment plans running currently.</p>
              <Button variant="primary" className="mt-3" onClick={() => openInvestModal()}>
                Invest Now
              </Button>
            </Card>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F8FAFC] font-sans">Recent Activity</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-[#34D399] hover:text-[#F4D06F] flex items-center gap-0.5"
            >
              <span>View All →</span>
            </button>
          </div>

          <div className="space-y-2">
            {recentTxns.map(txn => (
              <TransactionItem
                key={txn.id}
                transaction={txn}
                onClick={() => navigate('/history')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
