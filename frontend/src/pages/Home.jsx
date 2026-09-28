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
  TrendingUp,
  Sparkles,
  Wallet,
  PiggyBank,
  ChevronRight,
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
      {/* MAIN BALANCE CARD */}
      <Card gradient gradientColor="balance" className="relative overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                Total Portfolio Balance
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            
            <div className="text-3xl md:text-5xl font-black text-white font-mono mt-2 tracking-tight">
              {formatCurrency(balances.totalBalance)}
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                +₹850 (+7.1%)
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">All-time portfolio growth</span>
            </div>
          </div>

          {/* Balance breakdown grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-800/80 shrink-0">
            <div className="pr-2 border-r border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-medium">Available</p>
              <p className="text-sm md:text-base font-bold text-white font-mono mt-0.5">
                {formatCurrency(balances.availableBalance)}
              </p>
            </div>
            <div className="px-2 border-r border-slate-800/80">
              <p className="text-[11px] text-slate-400 font-medium">Invested</p>
              <p className="text-sm md:text-base font-bold text-slate-200 font-mono mt-0.5">
                {formatCurrency(balances.totalInvested)}
              </p>
            </div>
            <div className="pl-2">
              <p className="text-[11px] text-slate-400 font-medium">Earnings</p>
              <p className="text-sm md:text-base font-bold text-emerald-400 font-mono mt-0.5">
                {formatCurrency(balances.totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      </Card>

      {/* TODAY'S EARNING HIGHLIGHT CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Today's Earnings"
          value={`+${formatCurrency(balances.todayEarnings)}`}
          subtitle="Earned from active investments"
          icon={Sparkles}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          trend="+100% payout standard"
          trendType="up"
          highlight={true}
        />

        <StatCard
          title="Active Plans"
          value={`${activeInvestments.length} Active`}
          subtitle="Generating daily payouts"
          icon={Zap}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
          onClick={() => navigate('/plans')}
        />

        <StatCard
          title="Referral Rewards"
          value={formatCurrency(balances.referralEarnings)}
          subtitle="From 18 active team members"
          icon={PiggyBank}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
          onClick={() => navigate('/team')}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            variant="emerald"
            size="lg"
            icon={ArrowDownLeft}
            onClick={() => setIsDepositOpen(true)}
            className="w-full justify-center"
          >
            Deposit
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={Zap}
            onClick={() => openInvestModal()}
            className="w-full justify-center"
          >
            Invest
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={ArrowUpRight}
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full justify-center"
          >
            Withdraw
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={History}
            onClick={() => navigate('/history')}
            className="w-full justify-center"
          >
            History
          </Button>
        </div>
      </div>

      {/* PORTFOLIO PERFORMANCE CHART */}
      <Card className="p-5 md:p-6">
        <PortfolioChart />
      </Card>

      {/* ACTIVE INVESTMENT & RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ACTIVE INVESTMENTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-sans">Active Investment</h3>
            <button
              onClick={() => navigate('/plans')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
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
            <Card className="p-8 text-center text-slate-400">
              <p>No active investments currently running.</p>
              <Button variant="primary" className="mt-3" onClick={() => openInvestModal()}>
                Invest Now
              </Button>
            </Card>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-sans">Recent Activity</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              <span>View All History</span>
              <ChevronRight className="w-4 h-4" />
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
