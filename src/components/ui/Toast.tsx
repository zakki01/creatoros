import React, { createContext, useContext, useState, useCallback } from 'react';
import clsx from 'clsx';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { IconButton } from './IconButton';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast({ type: 'success', message, title }),
    [showToast]
  );
  const error = useCallback(
    (message: string, title?: string) => showToast({ type: 'error', message, title }),
    [showToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast({ type: 'warning', message, title }),
    [showToast]
  );
  const info = useCallback(
    (message: string, title?: string) => showToast({ type: 'info', message, title }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warning, info }}
    >
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="fixed top-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[70] pointer-events-none flex flex-col gap-2 pt-safe"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      toasts: [],
      showToast: () => '',
      removeToast: () => {},
      success: (msg: string) => console.log('Toast success:', msg),
      error: (msg: string) => console.error('Toast error:', msg),
      warning: (msg: string) => console.warn('Toast warning:', msg),
      info: (msg: string) => console.info('Toast info:', msg),
    } as unknown as ToastContextType;
  }
  return ctx;
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const iconConfig: Record<ToastType, { icon: React.ReactNode; color: string }> = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
      color: 'border-emerald-500/30 bg-emerald-50',
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-rose-700" />,
      color: 'border-rose-200 bg-rose-50',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-800" />,
      color: 'border-amber-500/30 bg-amber-50',
    },
    info: {
      icon: <Info className="w-5 h-5 text-[var(--primary)]" />,
      color: 'border-[var(--primary)]/25 bg-[var(--primary-soft)]',
    },
  };

  const cfg = iconConfig[toast.type];

  return (
    <div
      role="alert"
      className={clsx(
        'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] shadow-xl shadow-slate-900/10',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        cfg.color
      )}
    >
      <div className="shrink-0 mt-0.5">{cfg.icon}</div>
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{toast.title}</h4>
        )}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">{toast.message}</p>
      </div>
      <IconButton
        aria-label="Dismiss toast"
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="-mr-1.5 -mt-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        <X className="w-4 h-4" />
      </IconButton>
    </div>
  );
};
