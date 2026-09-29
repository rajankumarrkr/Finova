import React from 'react';

export const Badge = ({
  children,
  variant = 'emerald',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 rounded-md gap-1 font-bold tracking-wider",
    md: "text-xs px-2.5 py-1 rounded-lg gap-1.5 font-bold tracking-wide",
    lg: "text-sm px-3 py-1.5 rounded-xl gap-2 font-bold"
  };

  const variantStyles = {
    emerald: "bg-emerald-500/15 text-[#34D399] border border-emerald-500/30",
    success: "bg-emerald-500/15 text-[#34D399] border border-emerald-500/30",
    gold: "bg-amber-400/15 text-[#F4D06F] border border-amber-400/35",
    recommended: "bg-amber-400/20 text-[#F4D06F] border border-amber-400/40 shadow-sm shadow-amber-500/10",
    amber: "bg-amber-400/15 text-[#F4D06F] border border-amber-400/30",
    warning: "bg-amber-400/15 text-[#F4D06F] border border-amber-400/30",
    blue: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    purple: "bg-amber-400/15 text-[#F4D06F] border border-amber-400/30",
    rose: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    danger: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
    slate: "bg-[#123A29] text-[#A7B8AE] border border-emerald-500/20",
    outline: "bg-transparent text-[#A7B8AE] border border-emerald-500/20"
  };

  const dotColors = {
    emerald: "bg-[#34D399]",
    success: "bg-[#34D399]",
    gold: "bg-[#F4D06F]",
    recommended: "bg-[#F4D06F]",
    amber: "bg-[#F4D06F]",
    warning: "bg-[#F4D06F]",
    rose: "bg-rose-400",
    danger: "bg-rose-400",
    slate: "bg-[#A7B8AE]"
  };

  return (
    <span className={`inline-flex items-center uppercase font-mono ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.emerald} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant] || 'bg-[#34D399]'}`} />
      )}
      <span>{children}</span>
    </span>
  );
};
