import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Gift, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

export const TransactionItem = ({ transaction, onClick }) => {
  const { title, amount, isPositive, date, status, category, reference, type } = transaction;

  const getIcon = () => {
    switch (type) {
      case 'earning':
      case 'daily_earning':
      case 'earnings':
        return <TrendingUp className="w-5 h-5 text-[#34D399]" />;
      case 'referral':
      case 'referral_bonus':
      case 'referrals':
        return <Gift className="w-5 h-5 text-[#F4D06F]" />;
      case 'investment':
      case 'investments':
        return <ArrowUpRight className="w-5 h-5 text-[#F4D06F]" />;
      case 'withdrawal':
      case 'withdrawals':
        return <ArrowDownLeft className="w-5 h-5 text-rose-300" />;
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-[#34D399]" />;
      default:
        return <RefreshCw className="w-5 h-5 text-emerald-300" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'earning':
      case 'daily_earning':
      case 'earnings':
      case 'deposit':
        return 'bg-emerald-500/15 border-emerald-500/30';
      case 'referral':
      case 'referral_bonus':
      case 'referrals':
      case 'investment':
      case 'investments':
        return 'bg-amber-400/15 border-amber-400/30';
      case 'withdrawal':
      case 'withdrawals':
        return 'bg-rose-500/15 border-rose-500/30';
      default:
        return 'bg-[#123A29] border-emerald-500/20';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return <Badge variant="emerald" size="sm">Completed</Badge>;
      case 'Processing':
      case 'Pending':
        return <Badge variant="gold" size="sm">Processing</Badge>;
      case 'Awaiting Proof':
        return <Badge variant="slate" size="sm">Awaiting Proof</Badge>;
      case 'Failed':
      case 'Rejected':
        return <Badge variant="rose" size="sm">Failed</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3.5 md:p-4 rounded-2xl bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/30 transition-all duration-200 mb-2.5 last:mb-0 group cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`p-2.5 rounded-xl border ${getIconBg()} shrink-0 transition-transform group-hover:scale-105`}>
          {getIcon()}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#F8FAFC] truncate font-sans">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#71857A]">
            <span>{date}</span>
            {reference && (
              <>
                <span className="text-[#123A29]">•</span>
                <span className="font-mono text-[11px] text-[#A7B8AE] truncate max-w-[120px]">{reference}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <div className={`text-sm md:text-base font-bold font-mono ${isPositive ? 'text-[#34D399]' : 'text-rose-300'}`}>
          {isPositive ? '+' : '-'}{formatCurrency(amount)}
        </div>
        <div className="mt-1 flex justify-end">
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
};
