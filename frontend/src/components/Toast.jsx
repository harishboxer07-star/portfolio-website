import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast, success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info') }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all animate-bounce-in ${
              toast.type === 'success'
                ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-slate-900/90 text-rose-300 border-rose-500/40'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />}
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
