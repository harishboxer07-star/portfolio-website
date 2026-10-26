import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
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
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} rounded-2xl glass-panel shadow-2xl border border-white/10 overflow-hidden z-10 my-4 sm:my-8`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-slate-900/60">
          <h3 className="text-base sm:text-lg font-semibold text-white tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[calc(88vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
