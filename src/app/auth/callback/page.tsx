"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * L’échange OAuth se fait désormais via /api/auth/callback.
 * Cette page redirige vers login pour les anciens liens vers /auth/callback.
 */
export default function AuthCallbackRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1f12] to-[#0a1c2e] text-white">
      <p className="text-white/70 text-sm">Redirection…</p>
    </main>
  );
}
