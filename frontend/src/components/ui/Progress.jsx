import React from 'react';

export const Progress = ({
  value = 0,
  max = 100,
  color = 'emerald',
  height = 'h-2.5',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

  const barGradients = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-400 shadow-sm shadow-blue-500/50',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-400 shadow-sm shadow-purple-500/50',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-sm shadow-amber-500/50'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="text-slate-400 font-medium">Progress</span>
          <span className="text-slate-200 font-mono font-semibold">{value} / {max} Days ({percentage}%)</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${height} p-0.5 border border-slate-700/50`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barGradients[color] || barGradients.emerald}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
