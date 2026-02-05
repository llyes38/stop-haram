"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";

const EMAIL_KEY = "stopharam_email";
const PENDING_SESSION_KEY = "stopharam_pendingStripeSessionId";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"checking" | "paid" | "invalid">("checking");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.paid) {
          setStatus("paid");
          if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem(EMAIL_KEY);
            if (saved) setEmail(saved);
            window.localStorage.setItem(PENDING_SESSION_KEY, sessionId);
          }
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [sessionId]);

  useEffect(() => {
    if (status === "invalid") {
      router.replace("/checkout");
    }
  }, [status, router]);

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
      if (typeof window !== "undefined") {
        window.localStorage.setItem(EMAIL_KEY, value);
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6">
        <p className="text-white/70 text-sm">Vérification du paiement…</p>
      </main>
    );
  }

  if (status === "invalid") {
    return null;
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-10">
          <StopHaramLogo size={120} variant="dark" className="block" />
          <h1 className="text-xl font-bold mt-6">Paiement confirmé</h1>
          <p className="text-emerald-300 text-sm mt-1">Entre ton email pour recevoir ton lien magique et accéder à ton espace.</p>
        </header>

        <section className="flex-1">
          {sent ? (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4 text-center">
              <p className="text-emerald-200 text-sm font-medium">Va cliquer dans ton mail</p>
              <p className="text-white/70 text-xs mt-1">Tu recevras un lien pour accéder à ton espace. Clique dessus et tu seras connecté.</p>
            </div>
          ) : (
            <form onSubmit={handleSendLink} className="space-y-4">
              <label htmlFor="success-email" className="block text-white/80 text-sm font-medium">
                Email
              </label>
              <input
                id="success-email"
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
                {loading ? "Envoi…" : "Recevoir mon lien"}
              </button>
              {error && <p className="text-red-300 text-sm text-center">{error}</p>}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
