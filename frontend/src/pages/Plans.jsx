import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlanCard } from '../components/cards/PlanCard';
import { investmentPlansList } from '../data/mockData';
import { planService } from '../services/planService';
import { Info, Sparkles } from 'lucide-react';

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
      <div className="p-6 md:p-8 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12] relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[#F4D06F] text-xs font-bold font-mono tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Wealth Portfolios
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] font-sans tracking-tight">
            Investment Plans
          </h2>
          <p className="text-sm text-[#A7B8AE] mt-2 leading-relaxed font-sans">
            Choose a plan that fits your goals. Automated daily returns credited directly to your available balance.
          </p>
        </div>
      </div>

      {/* Plans Grid / Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-96 rounded-[18px] bg-[#123A29] border border-emerald-500/16 p-6 flex flex-col justify-between animate-pulse">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-[#0A261A] rounded-full" />
                <div className="h-8 w-40 bg-[#0A261A] rounded-xl" />
                <div className="h-12 w-full bg-[#0A261A] rounded-2xl" />
              </div>
              <div className="h-12 w-full bg-[#0A261A] rounded-2xl" />
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
      <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 text-xs text-[#A7B8AE] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#71857A] shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          <strong className="text-[#F8FAFC] font-semibold">Disclosure: </strong>
          Returns shown are calculated based on plan terms. Daily returns credit automatically every morning.
        </p>
      </div>
    </div>
  );
};
