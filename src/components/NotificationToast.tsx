import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info" | "warning";
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>>;
}

export default function NotificationToast({ toasts, setToasts }: NotificationToastProps) {
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const timerDuration = 3500;
        
        // Auto remove inside individual components
        return (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            duration={timerDuration}
          />
        );
      })}
    </div>
  );
}

interface ToastItemProps {
  key?: string;
  toast: ToastMessage;
  onClose: () => void;
  duration: number;
}

function ToastItem({ toast, onClose, duration }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: "bg-[#0F5132]/95 border-[#0F5132]/30",
      text: "text-white",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    },
    info: {
      bg: "bg-zinc-900/95 border-zinc-800/30",
      text: "text-white",
      icon: <Sparkles className="h-5 w-5 text-[#FF7A00] shrink-0" />,
    },
    warning: {
      bg: "bg-amber-900/95 border-amber-800/30",
      text: "text-white",
      icon: <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />,
    },
  };

  const itemConfig = config[toast.type] || config.info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl border text-sm backdrop-blur-md pointer-events-auto transition-all duration-300 transform animate-[slideIn_0.3s_ease-out] ${itemConfig.bg} ${itemConfig.text}`}
    >
      {itemConfig.icon}
      <div className="flex-1 font-medium select-none text-xs sm:text-sm">
        {toast.text}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
