"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { copyToClipboard } from "@/lib/share";

const PAID_KEY = "stopharam_paid";
const PENDING_GIFT_URL_KEY = "stopharam_pending_gift_url";
const PENDING_GIFT_SESSION_ID_KEY = "stopharam_pending_gift_session_id";

/**
 * /app : si pas payé => redirect /start (début onboarding) ; sinon afficher l'app.
 * Si on a un session_id cadeau en attente (payé mais pas vu la page success), on appelle gift/create pour récupérer le lien.
 */
export default function AppPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [pendingGiftUrl, setPendingGiftUrl] = useState<string | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);
  const [fetchingGift, setFetchingGift] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pendingUrl = window.localStorage.getItem(PENDING_GIFT_URL_KEY);
    if (pendingUrl) {
      window.localStorage.removeItem(PENDING_GIFT_URL_KEY);
      setPendingGiftUrl(pendingUrl);
      setAllowed(true);
      return;
    }
    const sessionId = window.localStorage.getItem(PENDING_GIFT_SESSION_ID_KEY);
    if (sessionId) {
      setFetchingGift(true);
      fetch("/api/gift/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json().catch(() => ({})))
        .then((data) => {
          window.localStorage.removeItem(PENDING_GIFT_SESSION_ID_KEY);
          if (data?.url) {
            setPendingGiftUrl(data.url);
            setAllowed(true);
          } else {
            const paid = window.localStorage.getItem(PAID_KEY) === "true";
            if (!paid) router.replace("/start");
            else setAllowed(true);
          }
        })
        .catch(() => {
          window.localStorage.removeItem(PENDING_GIFT_SESSION_ID_KEY);
          const paid = window.localStorage.getItem(PAID_KEY) === "true";
          if (!paid) router.replace("/start");
          else setAllowed(true);
        })
        .finally(() => setFetchingGift(false));
      return;
    }
    const paid = window.localStorage.getItem(PAID_KEY) === "true";
    if (!paid) {
      router.replace("/start");
      return;
    }
    setAllowed(true);
  }, [router]);

  const handleCopyGiftLink = async () => {
    if (pendingGiftUrl && (await copyToClipboard(pendingGiftUrl))) {
      setGiftCopied(true);
      setTimeout(() => setGiftCopied(false), 2000);
    }
  };

  if (allowed === null || fetchingGift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">{fetchingGift ? "Récupération du lien cadeau…" : "Chargement…"}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      {pendingGiftUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" role="dialog" aria-modal="true" aria-labelledby="gift-modal-title">
          <div className="w-full max-w-[380px] rounded-2xl bg-[#0d2818] border border-emerald-500/30 p-5 shadow-xl">
            <h2 id="gift-modal-title" className="text-emerald-200 font-semibold text-lg mb-2">Lien à partager</h2>
            <p className="text-white/80 text-sm mb-3">Partage ce lien à ton proche : il l&apos;ouvre sur son téléphone pour activer l&apos;offre.</p>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 mb-4 break-all text-white/90 text-xs">
              {pendingGiftUrl}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleCopyGiftLink} className="flex-1 rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-3 text-emerald-100 font-semibold text-sm">
                {giftCopied ? "Copié ✅" : "Copier"}
              </button>
              <button type="button" onClick={() => setPendingGiftUrl(null)} className="flex-1 rounded-xl bg-white/15 border border-white/30 py-3 text-white font-medium text-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <h1 className="text-xl font-bold">Ton espace</h1>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/home"
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-center hover:bg-gray-100 transition-colors"
          >
            Accéder à l&apos;app
          </Link>
        </div>
      </div>
    </main>
  );
}
