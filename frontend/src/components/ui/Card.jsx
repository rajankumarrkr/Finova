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
  const gradientStyles = {
    emerald: 'card-gradient-emerald border-emerald-500/20',
    purple: 'card-gradient-purple border-purple-500/20',
    blue: 'card-gradient-blue border-blue-500/20',
    balance: 'balance-card-bg'
  };

  const baseStyles = gradient
    ? gradientStyles[gradientColor] || gradientStyles.emerald
    : 'glass-panel';

  const interactiveStyles = interactive
    ? 'glass-panel-interactive cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl md:rounded-3xl shadow-xl shadow-black/40 border transition-all duration-200 ${baseStyles} ${interactiveStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
