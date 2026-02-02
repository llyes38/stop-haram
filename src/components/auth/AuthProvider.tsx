"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getState, setAuth, setProfile, setState } from "@/lib/authState";
import type { StopharamProfile, StopharamState } from "@/lib/authState";
import { loadProgress } from "@/lib/progressStorage";
import { saveUser } from "@/lib/storage";
import type { StopHaramUser } from "@/lib/storage";

type AuthContextType = {
  user: User | null;
  session: Session | null;
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

/** Hook aligné spec : loading, user { id, email }, isAuthenticated, isGuest */
export function useAuthStatus() {
  const { user, loading, ...rest } = useSupabaseAuth();
  return {
    loading,
    user: user ? { id: user.id, email: user.email ?? undefined } : null,
    isAuthenticated: !!user,
    isGuest: !user,
    ...rest,
  };
}

function syncAuthState(session: Session | null) {
  if (!session?.user) {
    // Ne pas marquer déconnecté si on était invité : peut être le retour OAuth (session pas encore en cookie)
    const wasGuest = typeof window !== "undefined" && window.localStorage.getItem("stopharam_guest_mode") === "true";
    if (!wasGuest) {
      setAuth({ isLoggedIn: false });
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("stopharam_guest_mode");
    }
    return;
  }
  const u = session.user;
  setAuth({ isLoggedIn: true, email: u.email ?? undefined });
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("stopharam_guest_mode");
  }
  // Ne pas écraser le prénom : c'est celui que l'user tape dans "Mon compte", pas le nom Google.
  // Le profil (prénom) sera chargé par hydrateFromProgress depuis Supabase.
}

function getGoogleFallbackName(user: User): string {
  return (
    (user.user_metadata?.full_name as string) ??
    (user.user_metadata?.name as string) ??
    user.email?.split("@")[0] ??
    "Utilisateur"
  );
}

function hydrateFromProgress(userId: string, sessionUser: User | null) {
  loadProgress(userId).then((data) => {
    // Prénom = celui enregistré dans "Mon compte" (Supabase), jamais le nom Google
    if (data.profile && typeof data.profile === "object" && Object.keys(data.profile).length > 0) {
      setProfile(data.profile as StopharamProfile);
    } else if (sessionUser) {
      // Nouveau compte : pas encore de prénom dans Mon compte → fallback Google une seule fois
      setProfile({ name: getGoogleFallbackName(sessionUser) });
    }
    if (data.state && typeof data.state === "object" && Object.keys(data.state).length > 0) {
      const loaded = data.state as StopharamState;
      const current = getState();
      // Invité qui a fini le parcours puis se connecte (Google) : ne pas écraser onboardingComplete
      const merged: StopharamState = current?.onboardingComplete === true && loaded?.onboardingComplete !== true
        ? { ...loaded, onboardingComplete: true }
        : loaded;
      setState(merged);
    }
    if (data.storage_user && typeof data.storage_user === "object") {
      try {
        saveUser(data.storage_user as StopHaramUser);
      } catch {
        /* ignore invalid shape */
      }
    }
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      syncAuthState(s);
      if (s?.user?.id) hydrateFromProgress(s.user.id, s.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      syncAuthState(s);
      if (s?.user?.id) hydrateFromProgress(s.user.id, s.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!user;
  const isGuest = !user;

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, isAuthenticated, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
