"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";
import { isOnboardingComplete } from "@/lib/authState";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const fromStart = searchParams.get("from") === "start";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callbackError = searchParams.get("error") === "callback";
  const notRegisteredError = searchParams.get("error") === "not_registered";

  useEffect(() => {
    if (fromStart) return;
    if (!isOnboardingComplete()) {
      router.replace("/start");
    }
  }, [router, fromStart]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!fromStart && !isOnboardingComplete()) {
        router.replace("/start");
        return;
      }
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${getSiteUrl()}/api/auth/callback?redirect=${encodeURIComponent(redirect)}` },
      });
      if (err) setError(err.message);
      else if (data?.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-10">
          <StopHaramLogo size={140} variant="dark" className="block" />
          <h1 className="text-xl font-bold mt-6">Connexion</h1>
          <p className="text-white/70 text-sm mt-1">
            Connecte-toi pour sauvegarder tes résultats et rejoindre les Stopprs.
          </p>
          <p className="text-white/50 text-xs mt-2">
            Connexion en 1 clic avec ton compte Google.
          </p>
        </header>

        <section className="flex-1 space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          {notRegisteredError && (
            <div className="rounded-xl bg-amber-500/20 border border-amber-400/40 px-4 py-3 text-center">
              <p className="text-amber-200 text-sm">
                Ce compte Google n&apos;a pas encore de parcours StopHaram. Fais le parcours (quiz, objectifs, plan), paie, puis inscris-toi avec ce compte Google pour pouvoir te reconnecter ensuite.
              </p>
              <Link href="/start" className="mt-2 inline-block text-emerald-400 text-sm font-medium hover:underline">
                Commencer le parcours
              </Link>
            </div>
          )}

          {(error || callbackError) && !notRegisteredError && (
            <div className="text-center space-y-2">
              <p className="text-red-300 text-sm">
                {callbackError ? "La connexion a échoué. Réessaie ou utilise un autre moyen." : error}
              </p>
              {(error?.toLowerCase().includes("redirect") || callbackError) && (
                <Link
                  href="/auth/google-setup"
                  className="text-emerald-400 text-xs hover:underline block"
                >
                  Problème Google (redirect_uri) → voir l’URI à configurer
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
