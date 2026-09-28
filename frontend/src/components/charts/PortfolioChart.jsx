import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { chartTimeframeData } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-base font-bold font-mono text-emerald-400">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">Portfolio Value</p>
      </div>
    );
  }
  return null;
};

export const PortfolioChart = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const data = chartTimeframeData[timeframe] || chartTimeframeData['1M'];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  return (
    <div className="w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-sans">Portfolio Performance</h3>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
              Growth Chart
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(12850)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +₹850 (+7.1%)
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xl transition-all duration-200 focus:outline-none ${
                timeframe === tf
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPortfolio)"
              activeDot={{ r: 6, fill: '#10B981', stroke: '#0B0F19', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
