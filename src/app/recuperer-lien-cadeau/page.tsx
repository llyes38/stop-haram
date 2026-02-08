"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { copyToClipboard } from "@/lib/share";

const PENDING_GIFT_URL_KEY = "stopharam_pending_gift_url";

function extractSessionId(urlOrInput: string): string | null {
  const s = urlOrInput.trim();
  if (s.startsWith("cs_") && s.length > 20) return s;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://x.com?${s}`);
    return u.searchParams.get("session_id");
  } catch {
    return null;
  }
}

export default function RecupererLienCadeauPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [giftUrl, setGiftUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = window.localStorage.getItem(PENDING_GIFT_URL_KEY);
    if (url) {
      window.localStorage.removeItem(PENDING_GIFT_URL_KEY);
      setGiftUrl(url);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGiftUrl(null);
    const sessionId = extractSessionId(input);
    if (!sessionId) {
      setError("Colle l'URL complète de la page de confirmation (après paiement) ou l'identifiant de session (cs_...).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gift/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        setGiftUrl(data.url);
        return;
      }
      setError(data?.error || "Lien non trouvé. Vérifie que le paiement était bien pour « Offrir à un proche ».");
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (giftUrl && (await copyToClipboard(giftUrl))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto py-12">
      <StopHaramLogo size={100} variant="dark" className="block mb-6" />
      <h1 className="text-xl font-bold text-white mb-2">Récupérer le lien cadeau</h1>
      {giftUrl ? (
        <>
          <p className="text-emerald-200 text-sm font-medium mb-2 text-center">Ton lien à partager :</p>
          <div className="w-full mb-4 rounded-xl bg-white/10 border border-white/20 px-4 py-3">
            <p className="break-all text-white/90 text-xs mb-3">{giftUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-lg bg-emerald-500/40 border border-emerald-400/50 py-2 text-emerald-100 font-medium text-sm"
            >
              {copied ? "Copié ✅" : "Copier le lien"}
            </button>
          </div>
          <p className="text-white/60 text-xs text-center mb-4">Partage ce lien à ton proche : il l&apos;ouvre sur son téléphone pour activer l&apos;offre.</p>
        </>
      ) : (
        <p className="text-white/70 text-sm text-center mb-6">
          Tu as payé pour offrir à un proche mais tu n&apos;as pas vu le lien ? Colle ici l&apos;URL de la page de confirmation (après le paiement Stripe).
        </p>
      )}
      {!giftUrl && (
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://stop-haram.com/success?session_id=cs_..."
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-3 text-emerald-100 font-semibold text-sm hover:bg-emerald-500/50 disabled:opacity-70"
          >
            {loading ? "Recherche…" : "Récupérer le lien"}
          </button>
        </form>
      )}
      {error && <p className="text-amber-200 text-sm text-center mt-3">{error}</p>}
      <button
        type="button"
        onClick={() => router.back()}
        className="mt-6 text-white/60 text-sm hover:text-white/80 underline"
      >
        Retour
      </button>
    </main>
  );
}
