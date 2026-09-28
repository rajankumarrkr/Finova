import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Info, Zap } from 'lucide-react';

export const InvestModal = () => {
  const { isInvestOpen, setIsInvestOpen, selectedPlanForInvest, handleInvestSubmit, user } = useApp();
  const [loading, setLoading] = useState(false);

  if (!selectedPlanForInvest) return null;

  const {
    badge,
    name,
    investmentAmount,
    dailyEarning,
    durationDays,
    scheduledEarnings,
    color = 'emerald'
  } = selectedPlanForInvest;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      handleInvestSubmit(selectedPlanForInvest, investmentAmount);
      setLoading(false);
    }, 600);
  };

  const isInsufficient = user.balances.availableBalance < investmentAmount;

  return (
    <Modal
      isOpen={isInvestOpen}
      onClose={() => setIsInvestOpen(false)}
      title="Confirm Investment"
      subtitle="Review plan terms before activating"
    >
      <div className="space-y-4">
        {/* Selected Plan Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{name}</h4>
              <p className="text-xs text-slate-400">Fixed return payout cycle</p>
            </div>
          </div>
          <Badge variant={color} size="md">{badge}</Badge>
        </div>

        {/* Investment Details List */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Investment Amount</span>
            <span className="font-mono font-bold text-white text-base">{formatCurrency(investmentAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Daily Return</span>
            <span className="font-mono font-bold text-emerald-400">+{formatCurrency(dailyEarning)} / day</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Plan Duration</span>
            <span className="font-mono font-semibold text-slate-200">{durationDays} Days</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
            <span className="text-slate-300 font-medium">Total Scheduled Earnings</span>
            <span className="font-mono font-extrabold text-emerald-300 text-lg">{formatCurrency(scheduledEarnings)}</span>
          </div>
        </div>

        {/* Balance Status Indicator */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Available Balance:</span>
          <span className={`font-mono font-bold ${isInsufficient ? 'text-rose-400' : 'text-slate-200'}`}>
            {formatCurrency(user.balances.availableBalance)}
          </span>
        </div>

        {isInsufficient && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>You need {formatCurrency(investmentAmount - user.balances.availableBalance)} more available balance to activate this plan.</span>
          </div>
        )}

        {/* Review Notice */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
          <span>Please review the plan details before continuing. Activation is immediate upon confirmation.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setIsInvestOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            loading={loading}
            disabled={isInsufficient}
            icon={Zap}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};
