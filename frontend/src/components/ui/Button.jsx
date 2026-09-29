import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#031C12] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-xl gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-6 py-3.5 rounded-2xl gap-2.5"
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-emerald-500 to-amber-300 hover:from-emerald-400 hover:to-amber-200 text-[#031C12] font-bold shadow-lg shadow-emerald-950/40 border border-emerald-400/40 focus:ring-emerald-500",
    gold: "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-[#031C12] font-bold shadow-lg shadow-amber-950/40 border border-amber-300/40 focus:ring-amber-400",
    secondary: "bg-[#0A261A] hover:bg-[#0E3021] text-[#F8FAFC] border border-emerald-500/30 focus:ring-emerald-500 shadow-md",
    outline: "bg-transparent border border-emerald-500/25 hover:border-emerald-500/50 text-[#A7B8AE] hover:text-[#F8FAFC] hover:bg-[#0A261A]/50 focus:ring-emerald-500",
    ghost: "text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]/80 focus:ring-emerald-500",
    emerald: "bg-emerald-500/10 hover:bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 focus:ring-emerald-500",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 focus:ring-rose-500",
    glass: "bg-[#0A261A]/80 hover:bg-[#0E3021] text-[#F8FAFC] backdrop-blur-md border border-emerald-500/20 focus:ring-emerald-500"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
