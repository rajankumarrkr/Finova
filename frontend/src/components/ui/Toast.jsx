import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast, closeToast } = useApp();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/90 text-rose-100',
    info: 'border-blue-500/30 bg-slate-900/95 text-slate-100'
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-md w-[calc(100%-2rem)] md:w-auto animate-bounce-subtle">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/80 ${borderStyles[toast.type] || borderStyles.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium pr-2 leading-snug">{toast.message}</p>
        <button
          onClick={closeToast}
          className="ml-auto p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
