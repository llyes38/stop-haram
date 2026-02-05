"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";

/**
 * Bannière affichée si invité sur /home, /quiz, /profile, /parcours.
 * Bouton : lien vers /login (Magic Link).
 */
export default function GuestBanner() {
  const router = useRouter();
  const { isGuest } = useAuthStatus();

  if (!isGuest) return null;

  return (
    <div className="mx-auto max-w-[420px] px-4 py-3">
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
        <p className="text-sm font-medium">
          Mode invité : tes progrès ne seront pas sauvegardés. Connecte-toi pour tout garder.
        </p>
        <p className="text-xs text-amber-200/90 mt-1">
          Crée un compte pour débloquer la synchronisation multi-appareils.
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Se connecter (lien magique)
          </button>
        </div>
      </div>
    </div>
  );
}
