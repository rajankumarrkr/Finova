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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-xl gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-6 py-3.5 rounded-2xl gap-2.5"
  };

  const variantStyles = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 focus:ring-emerald-500 border border-emerald-400/30",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 focus:ring-slate-500 border border-slate-700/80 shadow-md",
    outline: "border border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-800/50 focus:ring-slate-500",
    ghost: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus:ring-slate-500",
    emerald: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 focus:ring-emerald-500",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 focus:ring-rose-500 border border-rose-400/30",
    glass: "bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/10 focus:ring-white/30"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
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
