import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full sm:w-auto">
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = 'text-neon-accent';
          let borderAccent = 'border-neon-accent/30';

          switch (toast.type) {
            case 'success':
              iconColor = 'text-emerald-400';
              borderAccent = 'border-emerald-500/40';
              Icon = CheckCircle;
              break;
            case 'error':
              iconColor = 'text-rose-400';
              borderAccent = 'border-rose-500/40';
              Icon = AlertCircle;
              break;
            case 'warning':
              iconColor = 'text-amber-400';
              borderAccent = 'border-amber-500/40';
              Icon = AlertTriangle;
              break;
            default:
              iconColor = 'text-neon-accent';
              borderAccent = 'border-neon-accent/40';
              Icon = Info;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl bg-graphite/95 backdrop-blur-xl border ${borderAccent} text-chalk text-xs font-bold transition-all duration-200 ${
                toast.exiting ? 'opacity-0 translate-y-2' : 'animate-toast-enter'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <p className="flex-1 font-semibold pr-2 leading-relaxed">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-silver hover:text-chalk p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
