import React from 'react';
import { useApp } from '../context/AppContext';
import { PlanCard } from '../components/cards/PlanCard';
import { investmentPlansList } from '../data/mockData';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export const Plans = () => {
  const { openInvestModal } = useApp();

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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {investmentPlansList.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onInvest={openInvestModal}
          />
        ))}
      </div>

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
