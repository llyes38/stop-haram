"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Racine "/" → première page d'onboarding (/start).
 * Les utilisateurs déjà inscrits sont redirigés vers /home par AppGuard depuis /start.
 */
export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/start");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
      <p className="text-white/70 text-sm">Redirection…</p>
    </div>
  );
}
