import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-500/10 border-emerald-500/20',
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  highlight = false,
  className = '',
  onClick
}) => {
  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden ${highlight ? 'border-emerald-500/30 bg-emerald-950/20' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1.5 font-mono tracking-tight">{value}</h3>
          
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-sans">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
              {trendType === 'up' ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </span>
              ) : trendType === 'down' ? (
                <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <TrendingDown className="w-3 h-3" />
                  {trend}
                </span>
              ) : (
                <span className="text-slate-400">{trend}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl border ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        )}
      </div>

      {highlight && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
      )}
    </Card>
  );
};
