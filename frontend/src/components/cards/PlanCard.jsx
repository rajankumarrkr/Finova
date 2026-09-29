import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Zap, CheckCircle2, Sparkles } from 'lucide-react';

export const PlanCard = ({ plan, onInvest }) => {
  const {
    badge,
    name,
    investmentAmount,
    dailyEarning,
    durationDays,
    scheduledEarnings,
    roi,
    popular,
    features = []
  } = plan;

  return (
    <Card
      className={`relative flex flex-col justify-between h-full transition-all duration-300 ${
        popular
          ? 'border border-[#F4D06F]/50 bg-gradient-to-b from-[#0E3021] to-[#0A261A] shadow-xl shadow-[#031C12] scale-[1.02] z-10'
          : 'bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/35'
      }`}
    >
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-[#031C12] font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-[#031C12]" />
          Recommended
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={popular ? "recommended" : "emerald"} size="md" dot>
            {badge}
          </Badge>
          <span className="text-xs font-mono font-bold text-[#F4D06F] bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/25">
            {roi} Total ROI
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#F8FAFC] font-sans">{name}</h3>

        {/* Investment Amount */}
        <div className="mt-4 pb-4 border-b border-emerald-500/16">
          <span className="text-xs text-[#71857A] uppercase font-semibold tracking-wider">Required Investment</span>
          <div className="text-3xl font-extrabold text-[#F8FAFC] font-mono mt-0.5">
            {formatCurrency(investmentAmount)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 my-3 bg-[#061F15] rounded-2xl p-3 border border-emerald-500/16">
          <div>
            <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Daily Return</p>
            <p className="text-base font-bold font-mono mt-0.5 text-[#F4D06F]">
              +{formatCurrency(dailyEarning)}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Duration</p>
            <p className="text-base font-bold font-mono text-[#F8FAFC] mt-0.5">
              {durationDays} Days
            </p>
          </div>

          <div className="col-span-2 pt-2 border-t border-emerald-500/16 flex items-center justify-between">
            <span className="text-xs text-[#A7B8AE] font-semibold">Total Scheduled Return</span>
            <span className="text-sm font-extrabold font-mono text-[#34D399]">
              {formatCurrency(scheduledEarnings)}
            </span>
          </div>
        </div>

        {/* Features list */}
        {features.length > 0 && (
          <div className="space-y-2.5 my-4">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#A7B8AE]">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-4 pt-2">
        <Button
          variant={popular ? "gold" : "primary"}
          fullWidth
          size="lg"
          icon={Zap}
          onClick={() => onInvest(plan)}
        >
          Invest Now
        </Button>
      </div>
    </Card>
  );
};
