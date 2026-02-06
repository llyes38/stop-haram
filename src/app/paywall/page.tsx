"use client";

import { useRouter } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

export default function PaywallPage() {
  const router = useRouter();

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (_e) {}
    router.push("/paywall");
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0a1f12] via-[#0d2818] to-[#0a1c2e] text-white">
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 px-6 pt-12 pb-8">
        <header className="mb-10 text-center">
          <StopHaramLogo size={140} variant="dark" className="block mx-auto" />
          <h1 className="text-xl font-bold mt-6">Accès réservé aux abonnés</h1>
          <p className="text-white/70 text-sm mt-1">
            Abonne-toi pour débloquer tout le parcours.
          </p>
        </header>

        <section className="flex-1 flex flex-col justify-center gap-4">
          <button
            type="button"
            onClick={() => handleSubscribe("annual")}
            className="w-full rounded-xl bg-emerald-600 py-4 text-white font-semibold text-base hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-colors border border-emerald-500/50"
          >
            Abonnement annuel
          </button>
          <button
            type="button"
            onClick={() => handleSubscribe("monthly")}
            className="w-full rounded-xl bg-white/10 border border-white/20 py-4 text-white font-semibold text-base hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
          >
            Abonnement mensuel
          </button>
          <p className="text-center text-white/50 text-xs mt-4">
            Annulable à tout moment · Paiement sécurisé
          </p>
        </section>
      </div>
    </main>
  );
}
