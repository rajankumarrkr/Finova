import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

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
    color = 'emerald',
    features = []
  } = plan;

  const colorVariants = {
    emerald: {
      cardGrad: 'emerald',
      badgeVar: 'emerald',
      btnVar: 'primary',
      borderGlow: 'hover:border-emerald-500/40',
      textColor: 'text-emerald-400'
    },
    blue: {
      cardGrad: 'blue',
      badgeVar: 'blue',
      btnVar: 'secondary',
      borderGlow: 'hover:border-blue-500/40',
      textColor: 'text-blue-400'
    },
    purple: {
      cardGrad: 'purple',
      badgeVar: 'purple',
      btnVar: 'secondary',
      borderGlow: 'hover:border-purple-500/40',
      textColor: 'text-purple-400'
    },
    amber: {
      cardGrad: 'emerald',
      badgeVar: 'amber',
      btnVar: 'primary',
      borderGlow: 'hover:border-amber-500/40',
      textColor: 'text-amber-400'
    }
  };

  const currentTheme = colorVariants[color] || colorVariants.emerald;

  return (
    <Card
      gradient={true}
      gradientColor={currentTheme.cardGrad}
      className={`relative flex flex-col justify-between h-full transition-all duration-300 ${
        popular ? 'border-emerald-500/50 shadow-emerald-500/10 scale-[1.02] z-10' : ''
      } ${currentTheme.borderGlow}`}
    >
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-slate-950" />
          Most Popular Choice
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge variant={currentTheme.badgeVar} size="md" dot>
            {badge}
          </Badge>
          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {roi} Total ROI
          </span>
        </div>

        <h3 className="text-xl font-bold text-white font-sans">{name}</h3>

        {/* Big Investment Amount */}
        <div className="mt-4 pb-4 border-b border-slate-800/80">
          <span className="text-xs text-slate-400 uppercase font-medium">Required Investment</span>
          <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
            {formatCurrency(investmentAmount)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 my-2 bg-slate-950/40 rounded-2xl p-3 border border-slate-800/60">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Daily Return</p>
            <p className={`text-base font-bold font-mono mt-0.5 ${currentTheme.textColor}`}>
              +{formatCurrency(dailyEarning)}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Plan Duration</p>
            <p className="text-base font-bold font-mono text-slate-200 mt-0.5">
              {durationDays} Days
            </p>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Scheduled Earnings</span>
            <span className="text-sm font-extrabold font-mono text-white">
              {formatCurrency(scheduledEarnings)}
            </span>
          </div>
        </div>

        {/* Features list */}
        {features.length > 0 && (
          <div className="space-y-2.5 my-4">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-4 pt-2">
        <Button
          variant={currentTheme.btnVar}
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
