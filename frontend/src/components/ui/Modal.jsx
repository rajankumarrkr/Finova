import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} glass-panel border border-slate-700/60 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-auto transform transition-all duration-300 animate-scale-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-800/80">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
