"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isLoggedIn,
  isOnboardingComplete,
  isPublicRoute,
  isParcoursRoute,
} from "@/lib/authState";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import InstallPrompt from "./InstallPrompt";

export default function AppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const { loading: authLoading } = useSupabaseAuth();

  useEffect(() => {
    if (pathname == null) return;
    // Attendre que la session Supabase soit chargée avant de décider (évite de
    // rediriger vers /start alors que l’utilisateur vient de se connecter via l’API callback).
    if (authLoading) {
      return;
    }
    const loggedIn = isLoggedIn();
    const onboardingComplete = isOnboardingComplete();
    const isPublic = isPublicRoute(pathname);
    const isParcours = isParcoursRoute(pathname);

    if (isPublic) {
      const isLogoDemo = pathname === "/logo" || pathname.startsWith("/logo/");
      const isStartPage = pathname === "/start" || pathname.startsWith("/start/");
      // Utilisateur déjà inscrit (logged in + onboarding terminé) → aller directement sur l'app, pas sur /start
      if (loggedIn && onboardingComplete && !isLogoDemo) {
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

    // Pas encore inscrit (onboarding non terminé) → toujours (re)passer par la page d'accueil "Bienvenue" (/start)
    if (!onboardingComplete) {
      if (!isParcours) {
        router.replace("/start");
        return;
      }
      setReady(true);
      return;
    }

    setReady(true);
  }, [pathname, router, authLoading]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}
