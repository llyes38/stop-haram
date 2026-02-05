"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";
import { isOnboardingComplete } from "@/lib/authState";

const FROM_CHECKOUT_KEY = "stopharam_from_checkout";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parcours : /signup uniquement après paiement (checkout). Sinon redirection vers checkout.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(FROM_CHECKOUT_KEY) === "true") return;
    if (isOnboardingComplete()) return;
    router.replace("/checkout");
  }, [router]);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${getSiteUrl()}/api/auth/callback?redirect=/home&new_signup=1` },
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
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[12%] left-[10%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute top-[25%] left-[85%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute top-[50%] left-[15%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[70%] left-[80%] h-1 w-1 rounded-full bg-white/35" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-8">
        <header className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-white/60 text-sm">9:41</span>
        </header>

        <div className="flex flex-col items-center flex-1 pt-4">
          <StopHaramLogo size={160} variant="dark" className="block mb-2" />

          {/* Illustration : oiseau / palmiers style Quittr (simplifié) */}
          <div className="relative w-full max-w-[240px] h-[160px] flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-end justify-center gap-8 pb-4">
              <div className="w-12 h-20 rounded-t-full bg-emerald-600/40 border border-emerald-500/40" style={{ transform: "skew(-5deg)" }} />
              <div className="w-12 h-24 rounded-t-full bg-emerald-600/40 border border-emerald-500/40" style={{ transform: "skew(5deg)" }} />
            </div>
            <div className="relative w-16 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center -mb-2">
              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
            Deviens un Stoppr
          </h2>
          <p className="text-sm text-white/80 text-center max-w-[320px] mb-4">
            Rejoins ceux qui reprennent le contrôle. Connecte-toi avec Google pour sauvegarder ta progression et accéder à ton parcours sur tous tes appareils.
          </p>

          <div className="w-full max-w-[320px] space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-gray-900 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60 border-2 border-emerald-400/50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuer avec Google
            </button>

            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}
          </div>
        </div>

        <footer className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <span className="font-medium text-white/50">StopHaram</span>
        </footer>
      </div>
    </main>
  );
}
