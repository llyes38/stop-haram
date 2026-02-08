"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthNudgePopup from "@/components/AuthNudgePopup";
import BottomNav from "@/components/BottomNav";
import PrayerTimeReminder from "@/components/PrayerTimeReminder";
import PointsBadge from "@/components/PointsBadge";
import FlyingPoint from "@/components/FlyingPoint";
import { isLoggedIn, isOnboardingComplete, isParcoursRoute } from "@/lib/authState";
import { hasDecouverteSeen } from "@/lib/decouverteStorage";
import { hasRechuteCheckedToday, markRechuteDoneForToday } from "@/lib/rechuteCheck";
import { copyToClipboard } from "@/lib/share";

const PENDING_GIFT_URL_KEY = "stopharam_pending_gift_url";
const PENDING_GIFT_SESSION_ID_KEY = "stopharam_pending_gift_session_id";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [pendingGiftUrl, setPendingGiftUrl] = useState<string | null>(null);
  const [giftCopied, setGiftCopied] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/start");
      return;
    }
    if (!hasRechuteCheckedToday()) {
      markRechuteDoneForToday(true);
    }
    if (!hasDecouverteSeen()) {
      // Ne pas envoyer vers /decouverte si l'utilisateur est déjà sur le parcours (ex. /profile après "Continuer sans compte")
      if (isParcoursRoute(pathname) && !isOnboardingComplete()) {
        setReady(true);
        return;
      }
      router.replace("/decouverte");
      return;
    }
    setReady(true);
  }, [router, pathname]);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const url = window.localStorage.getItem(PENDING_GIFT_URL_KEY);
    if (url) {
      window.localStorage.removeItem(PENDING_GIFT_URL_KEY);
      setPendingGiftUrl(url);
      return;
    }
    const sessionId = window.localStorage.getItem(PENDING_GIFT_SESSION_ID_KEY);
    if (sessionId) {
      fetch("/api/gift/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json().catch(() => ({})))
        .then((data) => {
          window.localStorage.removeItem(PENDING_GIFT_SESSION_ID_KEY);
          if (data?.url) setPendingGiftUrl(data.url);
        })
        .catch(() => window.localStorage.removeItem(PENDING_GIFT_SESSION_ID_KEY));
    }
  }, [ready]);

  const handleCopyGiftLink = async () => {
    if (pendingGiftUrl && (await copyToClipboard(pendingGiftUrl))) {
      setGiftCopied(true);
      setTimeout(() => setGiftCopied(false), 2000);
    }
  };

  // Filet de sécurité : sur mobile, la redirection peut être lente → après 2,5 s on affiche le contenu pour ne pas rester bloqué sur "Chargement..."
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      {pendingGiftUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" role="dialog" aria-modal="true" aria-labelledby="gift-modal-title">
          <div className="w-full max-w-[380px] rounded-2xl bg-[#0d2818] border border-emerald-500/30 p-5 shadow-xl">
            <h2 id="gift-modal-title" className="text-emerald-200 font-semibold text-lg mb-2">Lien à partager</h2>
            <p className="text-white/80 text-sm mb-3">Partage ce lien à ton proche : il l&apos;ouvre sur son téléphone pour activer l&apos;offre.</p>
            <div className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 mb-4 break-all text-white/90 text-xs">
              {pendingGiftUrl}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyGiftLink}
                className="flex-1 rounded-xl bg-emerald-500/40 border border-emerald-400/50 py-3 text-emerald-100 font-semibold text-sm"
              >
                {giftCopied ? "Copié ✅" : "Copier"}
              </button>
              <button
                type="button"
                onClick={() => setPendingGiftUrl(null)}
                className="flex-1 rounded-xl bg-white/15 border border-white/30 py-3 text-white font-medium text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      <PrayerTimeReminder />
      <FlyingPoint targetRef={badgeRef} />
      <main className="flex-1 min-h-0 w-full max-w-[420px] mx-auto pb-20 overflow-y-auto overflow-x-hidden">
        <div ref={badgeRef} className="flex justify-end px-6 pt-4 pb-1">
          <PointsBadge />
        </div>
        {children}
        <p className="text-center text-white/70 text-xs px-4 py-4 pb-6 max-w-[420px] mx-auto">
          De temps en temps, rafraîchis l&apos;app pour avoir les dernières mises à jour.
        </p>
      </main>
      <AuthNudgePopup />
      <BottomNav />
    </div>
  );
}
