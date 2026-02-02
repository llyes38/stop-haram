"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { setAuth, setProfile, setState } from "@/lib/authState";
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
    setAuth({ isLoggedIn: false });
    return;
  }
  const u = session.user;
  setAuth({ isLoggedIn: true, email: u.email ?? undefined });
  setProfile({
    name:
      (u.user_metadata?.full_name as string) ??
      (u.user_metadata?.name as string) ??
      u.email?.split("@")[0] ??
      "Utilisateur",
  });
}

function hydrateFromProgress(userId: string) {
  loadProgress(userId).then((data) => {
    if (data.profile && typeof data.profile === "object" && Object.keys(data.profile).length > 0) {
      setProfile(data.profile as StopharamProfile);
    }
    if (data.state && typeof data.state === "object" && Object.keys(data.state).length > 0) {
      setState(data.state as StopharamState);
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
      if (s?.user?.id) hydrateFromProgress(s.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      syncAuthState(s);
      if (s?.user?.id) hydrateFromProgress(s.user.id);
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
