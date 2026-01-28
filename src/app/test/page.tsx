"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEYS = {
  is_logged_in: "is_logged_in",
  user_name: "user_name",
  last_rechute_check: "last_rechute_check",
} as const;

/**
 * Route d'accès test : simule connexion + rechute déjà faite, redirige vers l'accueil (/).
 * Ex. : http://localhost:3000/test
 */
export default function TestAccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.is_logged_in, "true");
      window.localStorage.setItem(STORAGE_KEYS.user_name, "Test");
      window.localStorage.setItem(STORAGE_KEYS.last_rechute_check, new Date().toISOString().slice(0, 10));
    }
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <p className="text-white/80">Redirection vers l&apos;accueil…</p>
    </div>
  );
}
