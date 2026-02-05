"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Inscription : après paiement Stripe, l'utilisateur entre son email sur /success et reçoit un Magic Link.
 * Cette page redirige vers /login (reconnexion par lien magique).
 */
export default function SignupPage() {
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
