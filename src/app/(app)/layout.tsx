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

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

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

  const badgeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
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
