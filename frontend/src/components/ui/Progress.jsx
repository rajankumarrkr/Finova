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
    emerald: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/30',
    gold: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-sm shadow-amber-500/30',
    amber: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-sm shadow-amber-500/30',
    blue: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30',
    purple: 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm shadow-amber-500/30'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="text-[#A7B8AE] font-medium">Progress</span>
          <span className="text-[#F4D06F] font-mono font-bold">{value} / {max} Days ({percentage}%)</span>
        </div>
      )}
      <div className={`w-full bg-[#061F15] rounded-full overflow-hidden ${height} p-0.5 border border-emerald-500/20`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barGradients[color] || barGradients.emerald}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
