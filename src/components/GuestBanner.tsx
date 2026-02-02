"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/siteUrl";

/**
 * Bannière affichée si invité sur /home, /quiz, /profile, /parcours.
 * Texte : "Mode invité : tes progrès ne seront pas sauvegardés. Connecte-toi pour tout garder."
 * Boutons : Google, Email (lien vers login pour magic link).
 */
export default function GuestBanner() {
  const router = useRouter();
  const { isGuest } = useAuthStatus();

  if (!isGuest) return null;

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${getSiteUrl()}/api/auth/callback?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/home")}` },
    });
  };

  return (
    <div className="mx-auto max-w-[420px] px-4 py-3">
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
        <p className="text-sm font-medium">
          Mode invité : tes progrès ne seront pas sauvegardés. Connecte-toi pour tout garder.
        </p>
        <p className="text-xs text-amber-200/90 mt-1">
          Crée un compte pour débloquer la synchronisation multi-appareils.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGoogle}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-lg border border-white/40 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
