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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const callbackError = searchParams.get("error") === "callback";

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/start");
    }
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Nouveau user (parcours non terminé) → doit faire onboarding + paiement sur /start, pas OAuth direct.
      if (!isOnboardingComplete()) {
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

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Indique ton email");
      return;
    }
    setLoading(true);
    setError(null);
    setMagicLinkSent(false);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${getSiteUrl()}/api/auth/callback?redirect=${encodeURIComponent(redirect)}` },
      });
      if (err) setError(err.message);
      else setMagicLinkSent(true);
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
            Google (1 clic) ou lien par email. Aucun mot de passe.
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

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/50 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              disabled={loading}
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500/30 border border-emerald-400/50 py-3.5 text-emerald-200 font-semibold text-sm hover:bg-emerald-500/40 transition-colors disabled:opacity-60"
            >
              Recevoir un lien par email
            </button>
          </form>

          {magicLinkSent && (
            <p className="text-emerald-300 text-sm text-center">
              Vérifie ta boîte mail : un lien de connexion t&apos;a été envoyé.
            </p>
          )}

          {(error || callbackError) && (
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
