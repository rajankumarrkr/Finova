import React from 'react';

export const Card = ({
  children,
  className = '',
  gradient = false,
  gradientColor = 'emerald',
  interactive = false,
  onClick,
  padding = 'p-5 md:p-6',
  ...props
}) => {
  const variantStyles = {
    emerald: 'bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/30',
    gold: 'bg-[#0A261A] border border-[#F4D06F]/35 shadow-[0_0_20px_-5px_rgba(244,208,111,0.08)]',
    elevated: 'bg-[#0E3021] border border-emerald-500/20',
    surface: 'bg-[#123A29] border border-emerald-500/16',
    balance: 'bg-gradient-to-br from-[#0E3021] via-[#0A261A] to-[#061F15] border border-[#F4D06F]/25 shadow-xl shadow-[#031C12]/80'
  };

  const baseStyles = gradient
    ? variantStyles[gradientColor] || variantStyles.emerald
    : 'bg-[#0A261A] border border-emerald-500/16';

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#031C12]/80 transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-[18px] shadow-lg shadow-[#031C12]/60 transition-all duration-200 ${baseStyles} ${interactiveStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
