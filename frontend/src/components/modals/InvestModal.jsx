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
    scheduledEarnings
  } = selectedPlanForInvest;

  const handleConfirm = async () => {
    setLoading(true);
    const success = await handleInvestSubmit(selectedPlanForInvest, investmentAmount);
    setLoading(false);
    if (success) {
      setIsInvestOpen(false);
    }
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
        <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#34D399]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#F8FAFC]">{name}</h4>
              <p className="text-xs text-[#71857A]">Fixed daily yield payout cycle</p>
            </div>
          </div>
          <Badge variant="gold" size="md">{badge}</Badge>
        </div>

        {/* Investment Details List */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#A7B8AE] font-semibold">Investment Amount</span>
            <span className="font-mono font-bold text-[#F8FAFC] text-base">{formatCurrency(investmentAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#A7B8AE] font-semibold">Daily Return</span>
            <span className="font-mono font-bold text-[#F4D06F]">+{formatCurrency(dailyEarning)} / day</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#A7B8AE] font-semibold">Plan Duration</span>
            <span className="font-mono font-semibold text-[#F8FAFC]">{durationDays} Days</span>
          </div>
          <div className="pt-2 border-t border-emerald-500/16 flex justify-between items-center text-sm">
            <span className="text-[#F8FAFC] font-semibold">Total Scheduled Return</span>
            <span className="font-mono font-extrabold text-[#34D399] text-lg">{formatCurrency(scheduledEarnings)}</span>
          </div>
        </div>

        {/* Balance Status Indicator */}
        <div className="p-3 rounded-xl bg-[#061F15] border border-emerald-500/16 flex items-center justify-between text-xs">
          <span className="text-[#A7B8AE] font-semibold">Available Balance:</span>
          <span className={`font-mono font-bold ${isInsufficient ? 'text-rose-300' : 'text-[#F8FAFC]'}`}>
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
        <div className="p-3 rounded-xl bg-[#061F15] border border-emerald-500/20 text-xs text-[#A7B8AE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#F4D06F]" />
          <span>Activation is immediate upon confirmation. Payouts automatically credit daily.</span>
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
            Confirm Investment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
