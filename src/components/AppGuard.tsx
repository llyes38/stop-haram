"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isLoggedIn,
  isOnboardingComplete,
  isPublicRoute,
  isParcoursRoute,
  FIRST_PARCOURS_STEP,
} from "@/lib/authState";

export default function AppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname == null) return;
    const loggedIn = isLoggedIn();
    const onboardingComplete = isOnboardingComplete();
    const isPublic = isPublicRoute(pathname);
    const isParcours = isParcoursRoute(pathname);

    if (isPublic) {
      if (loggedIn && onboardingComplete) {
        router.replace("/home");
        return;
      }
      setReady(true);
      return;
    }

    if (!loggedIn) {
      router.replace("/start");
      return;
    }

    if (!onboardingComplete) {
      if (!isParcours) {
        router.replace(FIRST_PARCOURS_STEP);
        return;
      }
      setReady(true);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return <>{children}</>;
}
