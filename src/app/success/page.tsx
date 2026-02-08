"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

const PAID_KEY = "stopharam_paid";
const PENDING_GIFT_URL_KEY = "stopharam_pending_gift_url";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const modeOffrir = searchParams.get("mode") === "offrir";
  const [status, setStatus] = useState<"checking" | "ok" | "gift" | "invalid" | "dev_offrir" | "gift_error">("checking");
  const [giftUrl, setGiftUrl] = useState<string | null>(null);

  const fetchGiftAndVerify = async () => {
    if (!sessionId || sessionId === "dev") return;
    const r = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { credentials: "include" });
    const data = await r.json().catch(() => ({}));
    if (data?.ok !== true) {
      setStatus("invalid");
      return;
    }
    // Toujours tenter gift/create : si c'est un cadeau (metadata), on affiche le lien ; sinon on redirige vers l'app.
    const res = await fetch("/api/gift/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
    const gift = await res.json().catch(() => ({}));
    if (gift?.url) {
      setGiftUrl(gift.url);
      setStatus("gift");
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PENDING_GIFT_URL_KEY, gift.url);
        window.location.href = "/app";
      }
      return;
    }
    if (res.status === 400 && (gift?.error === "Pas une session cadeau" || gift?.error?.includes("session cadeau"))) {
      // Paiement OK mais pas un cadeau → abo classique
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PAID_KEY, "true");
      }
      router.replace("/app");
      return;
    }
    setStatus("gift_error");
  };

  useEffect(() => {
    if (!sessionId) {
      setStatus("invalid");
      return;
    }
    if (sessionId === "dev" && modeOffrir) {
      setStatus("dev_offrir");
      return;
    }
    fetchGiftAndVerify().catch(() => setStatus("invalid"));
  }, [sessionId]);

  useEffect(() => {
    if (status === "invalid") {
      router.replace("/start");
    }
  }, [status, router]);

  if (status === "invalid") {
    return null;
  }

  if (status === "dev_offrir") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <p className="text-amber-200 font-semibold text-lg mb-2">Mode test (offrir)</p>
        <p className="text-white/90 text-sm text-center mb-4">
          Aucun paiement Stripe. En production, après avoir payé, tu verras ici le <strong>lien à partager</strong> à ton proche pour qu&apos;il active l&apos;offre sur son téléphone.
        </p>
        <button
          type="button"
          onClick={() => router.replace("/app")}
          className="w-full rounded-xl bg-white/15 border border-white/30 py-3 text-white font-medium text-sm"
        >
          Retour à l&apos;app
        </button>
      </main>
    );
  }

  if (status === "gift_error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <p className="text-amber-200 font-semibold text-lg mb-2">Paiement confirmé ✅</p>
        <p className="text-white/90 text-sm text-center mb-4">
          Le lien à partager n&apos;a pas pu être généré. Rafraîchis la page pour réessayer — le code sera créé à partir de ton paiement.
        </p>
        <button
          type="button"
          onClick={() => { setStatus("checking"); fetchGiftAndVerify(); }}
          className="w-full rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-3 text-emerald-100 font-semibold text-sm hover:bg-emerald-500/50 transition-colors"
        >
          Réessayer
        </button>
        <a
          href="/recuperer-lien-cadeau"
          className="mt-2 text-emerald-300 text-sm hover:text-emerald-200 underline"
        >
          Récupérer le lien plus tard (colle l&apos;URL de cette page)
        </a>
        <button
          type="button"
          onClick={() => router.replace("/app")}
          className="mt-3 text-white/60 text-sm hover:text-white/80 underline"
        >
          Retour à l&apos;app
        </button>
      </main>
    );
  }

  if (status === "gift" && giftUrl) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
        <p className="text-white/70 text-sm">Paiement confirmé ✅ Redirection vers l&apos;app…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
      <StopHaramLogo size={120} variant="dark" className="block mb-6" />
      <p className="text-white/70 text-sm">Paiement confirmé ✅ Redirection…</p>
    </main>
  );
}
