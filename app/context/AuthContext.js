"use client";
import { createContext, useContext, useSyncExternalStore } from "react";

const AuthContext = createContext(null);

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const getSnapshot = () => localStorage.getItem("token");
const getServerSnapshot = () => null;

export function AuthProvider({ children }) {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = (t) => {
    localStorage.setItem("token", t);
    emit();
  };
  const logout = () => {
    localStorage.removeItem("token");
    emit();
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
