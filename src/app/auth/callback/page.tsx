"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { setAuth, setProfile, completeOnboarding } from "@/lib/authState";

const DELAY_MS = 500;
const MAX_RETRIES = 3;

function syncLocalAuth(session: { user: { email?: string; user_metadata?: Record<string, unknown> } }) {
  setAuth({ isLoggedIn: true, email: session.user.email ?? undefined });
  setProfile({
    name:
      (session.user.user_metadata?.full_name as string) ??
      (session.user.user_metadata?.name as string) ??
      session.user.email?.split("@")[0] ??
      "Utilisateur",
  });
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/home";
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    const target = redirect || "/home";
    let subscription: { unsubscribe: () => void } | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const finish = (session: { user: unknown }) => {
      if (handled.current) return;
      handled.current = true;
      syncLocalAuth(session as { user: { email?: string; user_metadata?: Record<string, unknown> } });
      // Si redirection vers /home (signup), marquer l'onboarding comme terminé
      if (target === "/home" || target.startsWith("/home")) {
        completeOnboarding();
      }
      // Micro-delay pour laisser AuthProvider se mettre à jour avant la navigation
      setTimeout(() => router.replace(target), 50);
    };

    const run = async () => {
      // 0) Si code dans l'URL (PKCE), échanger contre une session
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeErr) {
            setError(exchangeErr.message);
            return;
          }
          if (data?.session?.user) {
            finish(data.session);
            return;
          }
        }
      }

      // 1) Essayer getSession avec retries (Supabase peut mettre un moment à parser le hash)
      for (let i = 0; i < MAX_RETRIES; i++) {
        const { data: { session }, error: err } = await supabase.auth.getSession();
        if (err) {
          setError(err.message);
          return;
        }
        if (session?.user) {
          finish(session);
          return;
        }
        if (i < MAX_RETRIES - 1) {
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }
      }

      // 2) Écouter onAuthStateChange au cas où la session arrive après
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        (event, s) => {
          if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && s?.user) {
            finish(s);
          }
        }
      );
      subscription = sub;

      timeoutId = setTimeout(() => {
        subscription?.unsubscribe();
        if (!handled.current) {
          handled.current = true;
          router.replace(`/login?error=callback`);
        }
      }, 4000);
    };

    run();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [router, redirect]);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6">
        <p className="text-red-300 text-sm mb-4">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="rounded-xl bg-white/10 px-4 py-2 text-white text-sm font-medium hover:bg-white/20"
        >
          Retour à la connexion
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white">
      <p className="text-white/70 text-sm">Connexion en cours…</p>
    </main>
  );
}
