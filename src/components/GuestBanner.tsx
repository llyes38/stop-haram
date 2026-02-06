"use client";

import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/components/auth/AuthProvider";

/**
 * Bannière affichée si non abonné (MVP : pas de compte, CTA = S'abonner).
 */
export default function GuestBanner() {
  const router = useRouter();
  const { isGuest } = useAuthStatus();

  if (!isGuest) return null;

  return (
    <div className="mx-auto max-w-[420px] px-4 py-3">
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
        <p className="text-sm font-medium">
          Abonne-toi pour débloquer tout le parcours et sauvegarder ta progression.
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => router.push("/start")}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            S&apos;abonner
          </button>
        </div>
      </div>
    </div>
  );
}
