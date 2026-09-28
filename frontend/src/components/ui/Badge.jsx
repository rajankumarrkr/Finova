import React from 'react';

export const Badge = ({
  children,
  variant = 'emerald',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 rounded-md gap-1 font-semibold tracking-wider",
    md: "text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium tracking-wide",
    lg: "text-sm px-3 py-1.5 rounded-xl gap-2 font-semibold"
  };

  const variantStyles = {
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    blue: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    info: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    slate: "bg-slate-800 text-slate-300 border border-slate-700",
    outline: "bg-transparent text-slate-300 border border-slate-700"
  };

  const dotColors = {
    emerald: "bg-emerald-400",
    success: "bg-emerald-400",
    blue: "bg-blue-400",
    info: "bg-blue-400",
    purple: "bg-purple-400",
    amber: "bg-amber-400",
    warning: "bg-amber-400",
    rose: "bg-rose-400",
    danger: "bg-rose-400",
    slate: "bg-slate-400",
    outline: "bg-slate-400"
  };

  return (
    <span className={`inline-flex items-center uppercase font-mono ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.emerald} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant] || 'bg-emerald-400'}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
