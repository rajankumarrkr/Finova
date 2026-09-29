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
    nextEarning
  } = investment;

  return (
    <Card className="relative overflow-hidden bg-[#0A261A] border border-emerald-500/20 shadow-lg shadow-[#031C12]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/15 text-[#34D399]">
            <Zap className="w-4 h-4" />
          </span>
          <h3 className="text-base md:text-lg font-bold text-[#F8FAFC] font-sans">{planName}</h3>
        </div>
        <Badge variant="emerald" size="sm" dot>
          Active
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[#061F15] rounded-xl border border-emerald-500/16 my-3">
        <div>
          <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Invested Amount</p>
          <p className="text-sm font-bold text-[#F8FAFC] font-mono mt-0.5">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Daily Earning</p>
          <p className="text-sm font-bold text-[#F4D06F] font-mono mt-0.5">+{formatCurrency(dailyEarning)} / day</p>
        </div>
        <div>
          <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Total Earned</p>
          <p className="text-sm font-bold text-[#34D399] font-mono mt-0.5">{formatCurrency(totalEarnedSoFar)}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#71857A] font-semibold uppercase tracking-wider">Next Payout</p>
          <p className="text-xs font-semibold text-[#F4D06F] flex items-center gap-1 mt-1 font-mono">
            <Clock className="w-3 h-3 text-[#F4D06F]" />
            {nextEarning}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <Progress value={completedDays} max={durationDays} showLabel color="emerald" />
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-emerald-500/16 flex items-center justify-between">
        <span className="text-xs text-[#71857A] font-medium">Started: {investment.startDate || 'Recently'}</span>
        <button
          onClick={() => onViewDetails && onViewDetails(investment)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#34D399] hover:text-[#F4D06F] transition-colors focus:outline-none"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
