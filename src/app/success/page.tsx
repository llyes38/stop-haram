"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { copyToClipboard } from "@/lib/share";

const PAID_KEY = "stopharam_paid";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const modeOffrir = searchParams.get("mode") === "offrir";
  const [status, setStatus] = useState<"checking" | "ok" | "gift" | "invalid" | "dev_offrir" | "gift_error">("checking");
  const [giftUrl, setGiftUrl] = useState<string | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);

  const fetchGiftAndVerify = async () => {
    if (!sessionId || sessionId === "dev") return;
    const r = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { credentials: "include" });
    const data = await r.json().catch(() => ({}));
    if (data?.ok !== true) {
      setStatus("invalid");
      return;
    }
    if (data?.gift === true && data?.plan) {
      const res = await fetch("/api/gift/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      const gift = await res.json().catch(() => ({}));
      if (gift?.url) {
        setGiftUrl(gift.url);
        setStatus("gift");
        return;
      }
      setStatus("gift_error");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PAID_KEY, "true");
    }
    router.replace("/app");
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

  const handleCopyGiftLink = async () => {
    if (giftUrl && (await copyToClipboard(giftUrl))) {
      setGiftCopied(true);
      setTimeout(() => setGiftCopied(false), 2000);
    }
  };

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
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <p className="text-emerald-200 font-semibold text-lg mb-2">Paiement confirmé ✅</p>
        <p className="text-white/90 text-sm text-center mb-4">
          Partage ce lien à ton proche : il l&apos;ouvre sur <strong>son téléphone</strong> pour activer l&apos;offre.
        </p>
        <div className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 mb-4 break-all text-white/90 text-xs">
          {giftUrl}
        </div>
        <button
          type="button"
          onClick={handleCopyGiftLink}
          className="w-full rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-3 text-emerald-100 font-semibold text-sm hover:bg-emerald-500/50 transition-colors"
        >
          {giftCopied ? "Lien copié ✅" : "Copier le lien"}
        </button>
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white px-6 max-w-[420px] mx-auto">
      <StopHaramLogo size={120} variant="dark" className="block mb-6" />
      <p className="text-white/70 text-sm">Paiement confirmé ✅ Redirection…</p>
    </main>
  );
}
