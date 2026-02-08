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
  const [status, setStatus] = useState<"checking" | "ok" | "gift" | "invalid">("checking");
  const [giftUrl, setGiftUrl] = useState<string | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { credentials: "include" })
      .then((r) => r.json())
      .then(async (data) => {
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
        }
        if (typeof window !== "undefined") {
          window.localStorage.setItem(PAID_KEY, "true");
        }
        router.replace("/app");
      })
      .catch(() => setStatus("invalid"));
  }, [sessionId, router]);

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
