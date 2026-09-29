import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast, closeToast } = useApp();

  if (!toast?.show) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#F4D06F] shrink-0" />
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-[#0E3021] text-[#F8FAFC]',
    error: 'border-rose-500/30 bg-[#0A261A] text-rose-200',
    info: 'border-amber-400/30 bg-[#0E3021] text-[#F8FAFC]'
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-md w-[calc(100%-2rem)] md:w-auto transition-all duration-300">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-[#031C12] ${borderStyles[toast.type] || borderStyles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-semibold pr-2 leading-snug">{toast.message}</p>
        <button
          onClick={closeToast}
          className="ml-auto p-1 text-[#71857A] hover:text-[#F8FAFC] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
