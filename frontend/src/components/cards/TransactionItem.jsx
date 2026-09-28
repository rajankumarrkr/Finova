import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Gift, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

export const TransactionItem = ({ transaction, onClick }) => {
  const { title, amount, isPositive, date, status, category, reference, type } = transaction;

  const getIcon = () => {
    switch (type) {
      case 'earning':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'referral':
        return <Gift className="w-5 h-5 text-purple-400" />;
      case 'investment':
        return <ArrowUpRight className="w-5 h-5 text-amber-400" />;
      case 'withdrawal':
        return <ArrowDownLeft className="w-5 h-5 text-rose-400" />;
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'earning':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'referral':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'investment':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'withdrawal':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'deposit':
        return 'bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return <Badge variant="emerald" size="sm">Completed</Badge>;
      case 'Processing':
        return <Badge variant="amber" size="sm">Processing</Badge>;
      case 'Failed':
        return <Badge variant="rose" size="sm">Failed</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3.5 md:p-4 rounded-2xl glass-panel-interactive border-slate-800/80 mb-2.5 last:mb-0 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`p-2.5 rounded-xl border ${getIconBg()} shrink-0 transition-transform group-hover:scale-105`}>
          {getIcon()}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate font-sans">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            <span>{date}</span>
            {reference && (
              <>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-[11px] truncate max-w-[120px]">{reference}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0 ml-3">
        <div className={`text-sm md:text-base font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-slate-200'}`}>
          {isPositive ? '+' : '-'}{formatCurrency(amount)}
        </div>
        <div className="mt-1 flex justify-end">
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
};
