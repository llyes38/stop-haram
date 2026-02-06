"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isLoggedIn,
  isOnboardingComplete,
  isPublicRoute,
  isParcoursRoute,
  isAppRoute,
} from "@/lib/authState";
import { useSupabaseAuth } from "@/components/auth/AuthProvider";
import InstallPrompt from "./InstallPrompt";

export default function AppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const { loading: authLoading, isAuthenticated: isEntitled } = useSupabaseAuth();

  useEffect(() => {
    if (pathname == null) return;
    // Racine "/" → toujours la 1ère page d'onboarding (évite d'atterrir sur /profile depuis le lien stop-haram.vercel.app)
    if (pathname === "/") {
      router.replace("/start");
      return;
    }
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
      if (isEntitled && onboardingComplete && !isLogoDemo) {
        router.replace("/home");
        return;
      }
      setReady(true);
      return;
    }

    // Pas payé (pas client) : rediriger vers le début de l'onboarding (parcours nouveau user), pas vers l'offre directe.
    if (!isEntitled) {
      if (pathname === "/app" || pathname.startsWith("/app/")) {
        router.replace("/start");
        return;
      }
      if (isAppRoute(pathname)) {
        router.replace("/start");
        return;
      }
      // Parcours / onboarding : profile, quiz, plan, offer, checkout, etc. → autoriser
      setReady(true);
      return;
    }

    // Pas encore inscrit (onboarding non terminé) → envoyer vers /home pour laisser l'hydratation Supabase charger user_progress (reconnexion), sinon /home redirigera vers le parcours
    if (!onboardingComplete) {
      if (!isParcours && pathname !== "/home" && !pathname.startsWith("/home")) {
        router.replace("/home");
        return;
      }
      setReady(true);
      return;
    }

    setReady(true);
  }, [pathname, router, authLoading, isEntitled]);

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
