'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.type)}
              border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out
              animate-in slide-in-from-right-full
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getToastIcon(toast.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                {toast.message && (
                  <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                )}
                
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="text-sm font-medium underline hover:no-underline mt-2 block"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Utility functions for common toast types
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'success', title, message, ...options });
    }
  },
  error: (title: string, message?: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'error', title, message, ...options });
    }
  },
  warning: (title: string, message?: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'warning', title, message, ...options });
    }
  },
  info: (title: string, message?: string, options?: Partial<Toast>) => {
    const context = useContext(ToastContext);
    if (context) {
      context.addToast({ type: 'info', title, message, ...options });
    }
  }
};

// Hook for easier usage
export const useToastHelpers = () => {
  const { addToast } = useToast();
  
  return {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'success', title, message, ...options });
    },
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'error', title, message, ...options });
    },
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'warning', title, message, ...options });
    },
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'info', title, message, ...options });
    }
  };
};