"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, type, title, message };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast("success", title, message);
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast("error", title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast("warning", title, message);
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast("info", title, message);
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
          border: "border-green-500/50",
          iconColor: "text-green-500",
        };
      case "error":
        return {
          icon: XCircle,
          bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
          border: "border-red-500/50",
          iconColor: "text-red-500",
        };
      case "warning":
        return {
          icon: AlertCircle,
          bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
          border: "border-yellow-500/50",
          iconColor: "text-yellow-500",
        };
      case "info":
        return {
          icon: Info,
          bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/50",
          iconColor: "text-blue-500",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            const Icon = styles.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`{styles.bg} ${styles.border} border-2 rounded-2xl p-4 backdrop-blur-xl shadow-2xl`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white mb-1">{toast.title}</h4>
                    {toast.message && (
                      <p className="text-sm text-white/70">{toast.message}</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`h-1 ${styles.iconColor.replace('text-', 'bg-')} rounded-full mt-3`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
