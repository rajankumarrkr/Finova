import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ActiveInvestmentCard } from '../components/cards/ActiveInvestmentCard';
import { TransactionItem } from '../components/cards/TransactionItem';
import { investmentService } from '../services/investmentService';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  Sparkles,
  Wallet,
  Coins,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  History as HistoryIcon
} from 'lucide-react';

export const MyInvestments = () => {
  const {
    user,
    activeInvestments: appActiveInvestments,
    transactions,
    refreshAppData
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [investments, setInvestments] = useState(appActiveInvestments || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFreshInvestments = async () => {
      setLoading(true);
      try {
        const res = await investmentService.getInvestments();
        if (isMounted && res?.success && Array.isArray(res.data)) {
          const formatted = res.data.map((inv) => ({
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
            status: inv.status || 'active',
          }));
          setInvestments(formatted);
        } else if (isMounted && appActiveInvestments) {
          setInvestments(appActiveInvestments);
        }
      } catch (err) {
        if (isMounted && appActiveInvestments) {
          setInvestments(appActiveInvestments);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFreshInvestments();
    return () => {
      isMounted = false;
    };
  }, [appActiveInvestments]);

  const activePlans = investments.filter(inv => inv.status === 'active' || !inv.status);
  const completedPlans = investments.filter(inv => inv.status === 'completed');

  // Filter transactions for investments
  const investmentTxns = transactions.filter(
    (t) => t.category?.toLowerCase() === 'investments' || t.type === 'investment'
  );

  const totalDailyReturn = activePlans.reduce((sum, inv) => sum + (Number(inv.dailyEarning) || 0), 0);
  const totalInvestedAmount = user.balances.totalInvested || activePlans.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* LUXURY BANNER */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[#F4D06F] text-xs font-bold font-mono tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Finova Portfolio • Live Asset Management
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-sans">
              My Investment
            </h2>
            <p className="text-xs md:text-sm text-[#A7B8AE] mt-1 max-w-xl font-sans">
              Real-time tracking of your active portfolios, automated daily yields, and maturity schedules.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="gold"
              size="lg"
              icon={Zap}
              onClick={() => navigate('/plans')}
            >
              Explore Plans
            </Button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* PORTFOLIO METRICS OVERVIEW (4 STAT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={formatCurrency(totalInvestedAmount)}
          subtitle={`${activePlans.length} Active Portfolio(s)`}
          icon={Wallet}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
          valueColor="text-[#F8FAFC]"
        />

        <StatCard
          title="Daily Return"
          value={`+${formatCurrency(totalDailyReturn || user.balances.todayEarnings)}`}
          subtitle="Automated daily payout"
          icon={TrendingUp}
          iconColor="text-[#34D399]"
          iconBg="bg-emerald-500/15 border-emerald-500/30"
          valueColor="text-[#34D399]"
        />

        <StatCard
          title="Total Yield Earned"
          value={formatCurrency(user.balances.totalEarnings || 0)}
          subtitle="Lifetime investment returns"
          icon={Coins}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
          valueColor="text-[#F4D06F]"
        />

        <StatCard
          title="Active Plans"
          value={`${activePlans.length} Running`}
          subtitle={`${completedPlans.length} Matured`}
          icon={ShieldCheck}
          iconColor="text-[#34D399]"
          iconBg="bg-emerald-500/15 border-emerald-500/30"
          valueColor="text-[#34D399]"
        />
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center justify-between border-b border-emerald-500/16 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-[#0E3021] text-[#F8FAFC] border border-emerald-500/30 shadow-md'
                : 'text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <span>Active Plans ({activePlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#0E3021] text-[#F8FAFC] border border-emerald-500/30 shadow-md'
                : 'text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]'
            }`}
          >
            <HistoryIcon className="w-4 h-4 text-[#F4D06F]" />
            <span>History ({investmentTxns.length})</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/plans')}
          className="text-xs font-bold text-[#34D399] hover:text-[#F4D06F] flex items-center gap-1 transition-colors"
        >
          <span>Activate New Plan</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'active' ? (
        <div>
          {activePlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlans.map((inv) => (
                <ActiveInvestmentCard
                  key={inv.id}
                  investment={inv}
                  onViewDetails={() => navigate('/plans')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center bg-[#061F15] border border-emerald-500/16 rounded-[18px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-[#F4D06F] flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-1 font-sans">No Active Investment Plans</h3>
              <p className="text-sm text-[#71857A] max-w-md mx-auto mb-6">
                You do not have any active investment plans generating daily returns currently. Activate a wealth portfolio to start earning daily payouts.
              </p>
              <Button
                variant="gold"
                size="lg"
                icon={Zap}
                onClick={() => navigate('/plans')}
              >
                Browse Investment Plans
              </Button>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {investmentTxns.length > 0 ? (
            <div className="space-y-2">
              {investmentTxns.map((txn) => (
                <TransactionItem
                  key={txn.id}
                  transaction={txn}
                  onClick={() => navigate('/history?tab=investments')}
                />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center bg-[#061F15] border border-emerald-500/16 rounded-[18px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-[#34D399] flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-1 font-sans">No Investment Transactions</h3>
              <p className="text-sm text-[#71857A] max-w-md mx-auto mb-6">
                Your past and active investment transactions will appear here once you activate your first plan.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/plans')}
              >
                Start Investing
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
