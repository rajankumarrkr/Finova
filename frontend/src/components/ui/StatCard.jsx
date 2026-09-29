import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#F4D06F]',
  iconBg = 'bg-[#123A29] border-emerald-500/20',
  trend,
  trendType = 'up',
  highlight = false,
  valueColor = 'text-[#F4D06F]', // Default gold for financial values
  className = '',
  onClick
}) => {
  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#0A261A] border border-emerald-500/16 ${highlight ? 'border-[#F4D06F]/40 bg-gradient-to-br from-[#0E3021] to-[#0A261A]' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider">{title}</p>
          <h3 className={`text-xl md:text-2xl font-extrabold mt-1.5 font-mono tracking-tight ${valueColor}`}>
            {value}
          </h3>
          
          {subtitle && (
            <p className="text-xs text-[#71857A] mt-1 flex items-center gap-1 font-sans font-medium">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
              {trendType === 'up' ? (
                <span className="inline-flex items-center gap-1 text-[#34D399] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </span>
              ) : trendType === 'down' ? (
                <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <TrendingDown className="w-3 h-3" />
                  {trend}
                </span>
              ) : (
                <span className="text-[#A7B8AE]">{trend}</span>
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
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full pointer-events-none" />
      )}
    </Card>
  );
};
