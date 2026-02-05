"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";
import { useAuthStatus } from "@/components/auth/AuthProvider";

const PENDING_SESSION_KEY = "stopharam_pendingStripeSessionId";

export default function CreateAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isAuthenticated, loading: authLoading } = useAuthStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.replace("/home");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (sessionId && typeof window !== "undefined") {
      window.localStorage.setItem(PENDING_SESSION_KEY, sessionId);
    }
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailVal = email.trim().toLowerCase();
    if (!emailVal) {
      setError("Indique ton email.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: signUpData, error: err } = await supabase.auth.signUp({
        email: emailVal,
        password,
        options: { emailRedirectTo: undefined },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (signUpData?.session) {
        router.replace("/home");
        return;
      }
      setError("Vérifie tes emails pour confirmer ton compte, puis connecte-toi depuis la page Connexion.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white">
        <p className="text-white/70 text-sm">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-10">
          <StopHaramLogo size={140} variant="dark" className="block" />
          <h1 className="text-xl font-bold mt-6">Créer ton compte</h1>
          <p className="text-white/70 text-sm mt-1">
            Paiement confirmé. Choisis un email et un mot de passe pour sécuriser ton accès.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <label htmlFor="create-email" className="block text-white/80 text-sm font-medium">
            Email
          </label>
          <input
            id="create-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            autoComplete="email"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          <label htmlFor="create-password" className="block text-white/80 text-sm font-medium">
            Mot de passe (min. 6 caractères)
          </label>
          <input
            id="create-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          <label htmlFor="create-confirm" className="block text-white/80 text-sm font-medium">
            Confirmer le mot de passe
          </label>
          <input
            id="create-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors disabled:opacity-60"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
          {error && <p className="text-red-300 text-sm text-center">{error}</p>}
        </form>

        <p className="mt-6 text-center text-white/60 text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
