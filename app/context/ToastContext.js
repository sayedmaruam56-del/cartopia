"use client";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(() => {});

const STYLES = {
  success: { icon: "✓", color: "text-emerald-400", bar: "bg-emerald-400" },
  error: { icon: "✕", color: "text-red-400", bar: "bg-red-400" },
  info: { icon: "✦", color: "text-brand-300", bar: "bg-brand-400" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-200 flex flex-col gap-3">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              className="toast glass spin-border pointer-events-auto relative flex min-w-[16rem] max-w-sm items-center gap-3 overflow-hidden rounded-2xl px-4 py-3"
            >
              <span className={`text-lg font-bold ${s.color}`}>{s.icon}</span>
              <p className="text-sm font-medium text-white">{t.message}</p>
              <span
                className={`toast-bar absolute bottom-0 left-0 h-0.5 ${s.bar}`}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
