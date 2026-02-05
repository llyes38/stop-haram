"use client";

import { useState } from "react";
import Link from "next/link";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) {
      setError("Indique ton email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(value, {
        redirectTo: `${getSiteUrl()}/reset-password`,
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
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
          <h1 className="text-xl font-bold mt-6">Mot de passe oublié</h1>
          <p className="text-white/70 text-sm mt-1">
            Entre ton email : on t&apos;envoie un lien pour réinitialiser ton mot de passe.
          </p>
        </header>

        {sent ? (
          <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4 text-center">
            <p className="text-emerald-200 text-sm font-medium">Vérifie tes emails</p>
            <p className="text-white/70 text-xs mt-1">
              Clique sur le lien reçu pour définir un nouveau mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="forgot-email" className="block text-white/80 text-sm font-medium">
              Email
            </label>
            <input
              id="forgot-email"
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
              {loading ? "Envoi…" : "Envoyer le lien"}
            </button>
            {error && <p className="text-red-300 text-sm text-center">{error}</p>}
          </form>
        )}

        <p className="mt-6 text-center text-white/60 text-sm">
          <Link href="/login" className="text-emerald-400 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
