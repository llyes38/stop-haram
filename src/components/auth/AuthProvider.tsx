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

  /** Déconnecte de l'app (redirige vers l'offre) sans supprimer le statut payé :
   * tu peux te "reconnecter" et rester reconnu comme ayant déjà payé (localStorage conservé). */
  const signOut = async () => {
    setAuth({ isLoggedIn: false });
    setIsPaid(false);
    // On ne supprime pas PAID_KEY : l'utilisateur reste "payé" sur cet appareil et pourra revenir sans repayer.
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
