"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";
import {
  canShowAuthNudge,
  markAuthNudgeShown,
  getGuestActionsCount,
  wasParcoursVisited,
  markParcoursVisited,
  incrementGuestActions,
} from "@/lib/authNudge";

/**
 * Popup "connecte-toi pour sauvegarder" max 1 fois par jour (localStorage last_auth_nudge_date).
 * Déclenchement : fin quiz (/analysis/result), début parcours (/parcours 1ère fois), ou après 2 actions invité.
 */
export default function AuthNudgePopup() {
  const router = useRouter();
  const pathname = usePathname();
  const { isGuest } = useAuthStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isGuest || !pathname) return;
    if (!canShowAuthNudge()) return;
    const finQuiz = pathname === "/analysis/result";
    const debutParcours = pathname.startsWith("/parcours") && !wasParcoursVisited();
    const afterTwoActions = getGuestActionsCount() >= 2;
    const allowed = ["/home", "/quiz", "/profile", "/parcours", "/"];
    const onAllowed = allowed.some((p) => pathname === p || pathname.startsWith(p + "/")) || finQuiz;
    if (!onAllowed) return;
    if (!finQuiz && !debutParcours && !afterTwoActions) return;
    if (debutParcours) {
      markParcoursVisited();
      incrementGuestActions();
    }
    setShow(true);
  }, [isGuest, pathname]);

  const handleDismiss = () => {
    markAuthNudgeShown();
    setShow(false);
  };

  const handleLogin = () => {
    markAuthNudgeShown();
    setShow(false);
    router.push("/login");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-[380px] rounded-xl border border-amber-500/40 bg-[#0d2818] p-4 shadow-lg">
      <p className="text-sm text-white/90">
        Connecte-toi pour sauvegarder et synchroniser tes progrès sur tous tes appareils.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleLogin}
          className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
        >
          Se connecter
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/70 hover:text-white"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
