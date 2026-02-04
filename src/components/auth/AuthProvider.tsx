"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getState, setAuth, setProfile, setState } from "@/lib/authState";
import type { StopharamProfile, StopharamState } from "@/lib/authState";
import { loadProgress, saveProgress } from "@/lib/progressStorage";
import { getUser, saveUser } from "@/lib/storage";
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
    setAuth({ isLoggedIn: false });
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
  loadProgress(userId).then(async (data) => {
    const hasAccountData = data?.storage_user && typeof data.storage_user === "object" && Object.keys(data.storage_user).length > 0;
    const hasState = data?.state && typeof data.state === "object" && Object.keys(data.state).length > 0;

    // Prénom = celui enregistré dans "Mon compte" (Supabase), jamais le nom Google
    if (data?.profile && typeof data.profile === "object" && Object.keys(data.profile).length > 0) {
      setProfile(data.profile as StopharamProfile);
    } else if (sessionUser) {
      setProfile({ name: getGoogleFallbackName(sessionUser) });
    }

    if (hasAccountData && hasState) {
      // Compte existant : restaurer state et user
      const loaded = data.state as StopharamState;
      const current = getState();
      const merged: StopharamState = current?.onboardingComplete === true && loaded?.onboardingComplete !== true
        ? { ...loaded, onboardingComplete: true }
        : loaded;
      setState(merged);
      try {
        saveUser(data.storage_user as StopHaramUser);
      } catch {
        /* ignore invalid shape */
      }
    } else {
      // Aucune donnée Supabase : invité qui vient de lier Google → sauvegarder son parcours ; sinon nouveau compte → onboarding
      const localUser = typeof window !== "undefined" ? getUser() : null;
      const localState = getState();
      // Onboarding terminé côté invité = ne pas renvoyer au parcours (plan peut ne pas être encore en localStorage)
      const hasGuestCompleted = localState?.onboardingComplete === true;
      if (hasGuestCompleted && localState) {
        const profile = getProfile();
        await saveProgress(
          { state: localState as unknown as Record<string, unknown>, profile: profile as unknown as Record<string, unknown>, storage_user: (localUser ?? {}) as unknown as Record<string, unknown> },
          userId
        );
        setState(localState);
        if (localUser) saveUser(localUser);
      } else {
        setState({ onboardingComplete: false });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("stopharam_user");
        }
      }
    }
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let delaySyncNull: ReturnType<typeof setTimeout> | null = null;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) {
        syncAuthState(s);
        hydrateFromProgress(s.user.id, s.user);
      } else {
        // Ne pas marquer déconnecté tout de suite : laisse le temps au clic "Continuer avec Google" de lancer la redirection OAuth (évite le flash vers l'onboarding au 1er clic).
        delaySyncNull = window.setTimeout(() => {
          syncAuthState(null);
        }, 400);
      }
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

    return () => {
      if (delaySyncNull != null) clearTimeout(delaySyncNull);
      subscription.unsubscribe();
    };
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
