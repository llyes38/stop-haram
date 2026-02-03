"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthNudgePopup from "@/components/AuthNudgePopup";
import BottomNav from "@/components/BottomNav";
import GuestBanner from "@/components/GuestBanner";
import PrayerTimeReminder from "@/components/PrayerTimeReminder";
import PointsBadge from "@/components/PointsBadge";
import { useAuthStatus } from "@/components/auth/AuthProvider";
import { isLoggedIn, isOnboardingComplete, isParcoursRoute } from "@/lib/authState";

const GUEST_MODE_KEY = "stopharam_guest_mode";
import { hasDecouverteSeen } from "@/lib/decouverteStorage";
import { hasRechuteCheckedToday, markRechuteDoneForToday } from "@/lib/rechuteCheck";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isGuest: isGuestAuth, user: authUser } = useAuthStatus();
  const [guestModeFlag, setGuestModeFlag] = useState(false);
  const [ready, setReady] = useState(false);
  const isGuest = isGuestAuth || guestModeFlag;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuestModeFlag(window.localStorage.getItem(GUEST_MODE_KEY) === "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && authUser) {
      window.localStorage.removeItem("stopharam_intent_google");
    }
  }, [authUser]);

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

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      <PrayerTimeReminder />
      <main className="flex-1 min-h-0 w-full max-w-[420px] mx-auto pb-20 overflow-y-auto overflow-x-hidden">
        <GuestBanner />
        {!isGuest && (
        <div className="flex justify-end px-6 pt-4 pb-1">
          <PointsBadge />
        </div>
        )}
        {children}
      </main>
      <AuthNudgePopup />
      <BottomNav />
    </div>
  );
}
