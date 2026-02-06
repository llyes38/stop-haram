"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /paywall : redirige vers l'offre (page utile) au lieu d'afficher une page intermédiaire.
 */
export default function PaywallPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/offer");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white/70 text-sm">
      Redirection…
    </div>
  );
}
