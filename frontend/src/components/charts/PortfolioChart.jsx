import React, { useState, useEffect } from 'react';
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
import { TrendingUp, Loader2 } from 'lucide-react';
import { getPerformance } from '../../services/dashboardService';
import { useApp } from '../../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A261A] border border-amber-400/30 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-xs text-[#A7B8AE] font-semibold mb-1">{label}</p>
        <p className="text-base font-bold font-mono text-[#F4D06F]">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-[10px] text-[#71857A] mt-0.5 font-sans">Portfolio Valuation</p>
      </div>
    );
  }
  return null;
};

export const PortfolioChart = () => {
  const { user } = useApp();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState(chartTimeframeData['1M']);
  const [loading, setLoading] = useState(false);

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  useEffect(() => {
    let isMounted = true;
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const res = await getPerformance(timeframe);
        if (isMounted && res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setChartData(res.data);
        } else if (isMounted && chartTimeframeData[timeframe]) {
          setChartData(chartTimeframeData[timeframe]);
        }
      } catch (err) {
        if (isMounted && chartTimeframeData[timeframe]) {
          setChartData(chartTimeframeData[timeframe]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChartData();

    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const currentTotal = user?.balances?.totalBalance || 0;

  return (
    <div className="w-full bg-[#081D14] p-5 md:p-6 rounded-[18px] border border-emerald-500/16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#F8FAFC] font-sans">Portfolio Performance</h3>
            <span className="text-[11px] font-mono text-[#71857A] bg-[#0A261A] border border-emerald-500/16 px-2 py-0.5 rounded-md flex items-center gap-1">
              Wealth Growth
              {loading && <Loader2 className="w-3 h-3 animate-spin text-[#F4D06F] inline" />}
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-[#F4D06F] font-mono tracking-tight">
              {formatCurrency(currentTotal)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#34D399] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +7.1% P.A.
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-[#061F15] border border-emerald-500/16 rounded-2xl self-start sm:self-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              disabled={loading}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all duration-200 focus:outline-none ${
                timeframe === tf
                  ? 'bg-[#123A29] text-[#F4D06F] border border-emerald-500/30 shadow-sm shadow-[#031C12]'
                  : 'text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full relative">
        {loading && (
          <div className="absolute inset-0 bg-[#031C12]/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-2 bg-[#0A261A] border border-emerald-500/30 px-4 py-2 rounded-xl shadow-xl text-xs text-[#F4D06F] font-mono font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating timeframe data...</span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#71857A"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            <YAxis
              stroke="#71857A"
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
              activeDot={{ r: 6, fill: '#F4D06F', stroke: '#031C12', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
