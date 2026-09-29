import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlanCard } from '../components/cards/PlanCard';
import { investmentPlansList } from '../data/mockData';
import { planService } from '../services/planService';
import { ShieldCheck, Info, Sparkles, Loader2 } from 'lucide-react';

export const Plans = () => {
  const { openInvestModal, plans: appPlans } = useApp();
  const [plans, setPlans] = useState(appPlans || []);
  const [loading, setLoading] = useState(!appPlans || appPlans.length === 0);

  useEffect(() => {
    let isMounted = true;
    const fetchPlans = async () => {
      try {
        const res = await planService.getPlans();
        if (isMounted && res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        } else if (isMounted && (!appPlans || appPlans.length === 0)) {
          setPlans(investmentPlansList);
        }
      } catch (err) {
        if (isMounted && (!appPlans || appPlans.length === 0)) {
          setPlans(investmentPlansList);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, [appPlans]);

  const displayPlans = plans.length > 0 ? plans : investmentPlansList;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 md:p-8 rounded-3xl balance-card-bg border border-emerald-500/20 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Wealth Portfolios
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
            High-Yield Fixed Investment Plans
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Select an automated plan to receive daily returns credited straight into your available wallet. No lock-in hidden penalties, 0% platform transaction fee.
          </p>
        </div>
      </div>

      {/* Plans Grid / Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between animate-pulse">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-slate-800 rounded-full" />
                <div className="h-8 w-40 bg-slate-800 rounded-xl" />
                <div className="h-12 w-full bg-slate-800 rounded-2xl" />
              </div>
              <div className="h-12 w-full bg-slate-800 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {displayPlans.map((plan) => {
            const normalizedPlan = {
              ...plan,
              id: plan._id || plan.id,
              badge: plan.badge || 'ACTIVE',
              roi: plan.roi || '99%',
              scheduledEarnings: plan.scheduledEarnings || (plan.dailyEarning * plan.durationDays),
              color: plan.color || 'emerald',
            };
            return (
              <PlanCard
                key={normalizedPlan.id}
                plan={normalizedPlan}
                onInvest={openInvestModal}
              />
            );
          })}
        </div>
      )}

      {/* Financial Disclosure */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">Disclosure: </strong>
          Returns and earnings shown are based on the selected plan configuration. Actual availability and terms are subject to platform rules. All investments carry risk, and historical performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
};
