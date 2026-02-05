"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { setAuth } from "@/lib/authState";

const PAID_KEY = "stopharam_paid";

type AuthContextType = {
  user: null;
  session: null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isGuest: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isAuthenticated: false,
  isGuest: true,
});

export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useAuthStatus() {
  const { user, loading, ...rest } = useSupabaseAuth();
  return {
    loading,
    user: user ? { id: "", email: undefined } : null,
    isAuthenticated: !!user,
    isGuest: !user,
    ...rest,
  };
}

/** MVP : accès = localStorage stopharam_paid === "true". Aucun compte, aucun Supabase. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  const syncPaid = () => {
    if (typeof window === "undefined") return;
    const paid = window.localStorage.getItem(PAID_KEY) === "true";
    setIsPaid(paid);
    setAuth({ isLoggedIn: paid });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    syncPaid();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (pathname === "/app" || pathname?.startsWith("/app/") || pathname === "/home" || pathname?.startsWith("/home")) {
      syncPaid();
    }
  }, [pathname]);

  const signOut = async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(PAID_KEY);
    }
    setAuth({ isLoggedIn: false });
    setIsPaid(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        loading,
        signOut,
        isAuthenticated: isPaid,
        isGuest: !isPaid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
