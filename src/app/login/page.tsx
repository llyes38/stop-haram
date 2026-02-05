"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";
import { useAuthStatus } from "@/components/auth/AuthProvider";

const EMAIL_KEY = "stopharam_email";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthStatus();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.replace("/home");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(EMAIL_KEY);
    if (saved) setEmail(saved);
  }, []);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) {
      setError("Indique ton email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: `${getSiteUrl()}/auth/callback`,
        },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (typeof window !== "undefined") window.localStorage.setItem(EMAIL_KEY, value);
      setSent(true);
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
          <h1 className="text-xl font-bold mt-6">Se reconnecter</h1>
          <p className="text-white/70 text-sm mt-1">
            Tu es déjà inscrit ? Entre ton email : on t’envoie un nouveau lien par mail (pas de mot de passe). Clique sur le lien et tu seras connecté.
          </p>
        </header>

        <section className="flex-1 space-y-4">
          {sent ? (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4 text-center">
              <p className="text-emerald-200 text-sm font-medium">Vérifie tes emails</p>
              <p className="text-white/70 text-xs mt-1">
                Clique sur le lien reçu pour accéder à ton espace.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendLink} className="space-y-4">
              <label htmlFor="login-email" className="block text-white/80 text-sm font-medium">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                autoComplete="email"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-60"
              >
                {loading ? "Envoi…" : "Recevoir le lien magique"}
              </button>
              {error && <p className="text-red-300 text-sm text-center">{error}</p>}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
