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
        className="fixed inset-0 bg-[#031C12]/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} bg-[#0A261A] border border-emerald-500/20 rounded-[22px] shadow-2xl shadow-[#031C12] overflow-hidden z-10 my-auto transform transition-all duration-300 animate-scale-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-emerald-500/16 bg-[#0E3021]">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#F8FAFC] tracking-tight font-sans">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#A7B8AE] mt-0.5">{subtitle}</p>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#123A29] transition-colors focus:outline-none"
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
