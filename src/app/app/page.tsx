"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

const PAID_KEY = "stopharam_paid";

/**
 * /app : si localStorage.stopharam_paid !== "true" => redirect /paywall, sinon afficher l'app.
 */
export default function AppPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const paid = window.localStorage.getItem(PAID_KEY) === "true";
    if (!paid) {
      router.replace("/paywall");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e]">
        <p className="text-white/70 text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <StopHaramLogo size={120} variant="dark" className="block mb-6" />
        <h1 className="text-xl font-bold">Ton espace</h1>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/home"
            className="w-full rounded-xl bg-white py-4 text-gray-900 font-semibold text-center hover:bg-gray-100 transition-colors"
          >
            Accéder à l&apos;app
          </Link>
        </div>
      </div>
    </main>
  );
}
