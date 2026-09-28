import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { formatCurrency } from '../../utils/formatters';
import { ChevronRight, Clock, Zap } from 'lucide-react';

export const ActiveInvestmentCard = ({ investment, onViewDetails }) => {
  const {
    planName,
    badge,
    amount,
    dailyEarning,
    durationDays,
    completedDays,
    totalEarnedSoFar,
    nextEarning,
    color = 'emerald'
  } = investment;

  return (
    <Card gradient gradientColor={color} className="relative overflow-hidden border-emerald-500/30">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap className="w-4 h-4" />
          </span>
          <h3 className="text-base md:text-lg font-bold text-white">{planName}</h3>
        </div>
        <Badge variant={color} size="sm" dot>
          Active
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 my-3">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Investment</p>
          <p className="text-sm font-bold text-white font-mono mt-0.5">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Daily Return</p>
          <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">+{formatCurrency(dailyEarning)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Earned So Far</p>
          <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">{formatCurrency(totalEarnedSoFar)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Next Payout</p>
          <p className="text-xs font-semibold text-amber-400 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {nextEarning}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <Progress value={completedDays} max={durationDays} showLabel color={color} />
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Started: {investment.startDate || '22 Aug 2026'}</span>
        <button
          onClick={() => onViewDetails && onViewDetails(investment)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
