"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateLastRoute } from "@/lib/authState";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

const PAID_KEY = "stopharam_paid";

// Tarif mensuel normal 9,99 € → annuel 119,88 € ; -50 % Ramadan = 59,94 €/an = 4,99 €/mois
const MONTHLY_PRICE = 9.99;
const YEARLY_FULL = MONTHLY_PRICE * 12; // 119,88 €
const DISCOUNT_PERCENT = 50;
const YEARLY_DISCOUNTED = (YEARLY_FULL * (100 - DISCOUNT_PERCENT)) / 100; // 59,94 €
const MONTHLY_EQUIVALENT = Math.floor((YEARLY_DISCOUNTED / 12) * 100) / 100; // 4,995 → 4,99 €/mois

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " €";
}

export default function OfferPage() {
  const router = useRouter();
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  useEffect(() => {
    updateLastRoute("/offer");
    if (typeof window !== "undefined" && window.localStorage.getItem(PAID_KEY) === "true") {
      setAlreadyPaid(true);
    }
  }, []);

  const handleClaim = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "annual" }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (_e) {
      /* fallback */
    }
    router.push("/checkout");
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      {/* Texture étoiles */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[12%] left-[10%] h-1 w-1 rounded-full bg-white/50" />
        <span className="absolute top-[22%] left-[85%] h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="absolute top-[45%] left-[15%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[60%] left-[80%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[78%] left-[25%] h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-8">
        {/* Header: logo + fermer */}
        <header className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <StopHaramLogo size={120} variant="dark" className="block" />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
            aria-label="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Déjà abonné : accès direct à l'app */}
        {alreadyPaid && (
          <section className="rounded-2xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-4 mb-6">
            <p className="text-emerald-200 font-semibold text-center mb-3">Tu as déjà accès</p>
            <Link
              href="/app"
              className="block w-full rounded-xl bg-emerald-500 py-3 text-white font-semibold text-center hover:bg-emerald-600 transition-colors"
            >
              Aller à l&apos;app
            </Link>
          </section>
        )}

        {/* Titre offre */}
        <section className="text-center mt-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
            Offre exceptionnelle
          </h1>
          <p className="text-sm text-white/80 mt-1">
            Tu ne la reverras plus.
          </p>
        </section>

        {/* Carte -50 % */}
        <section className="flex flex-col items-center mb-6">
          <div className="w-full max-w-[280px] rounded-2xl bg-gradient-to-br from-violet-500/40 via-indigo-500/40 to-blue-600/40 border border-white/20 px-6 py-8 text-center shadow-xl">
            <span className="text-5xl sm:text-6xl font-bold text-white">
              {DISCOUNT_PERCENT}%
            </span>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/90 mt-1">
              de réduction
            </p>
          </div>
          <p className="text-sm text-white/85 mt-4 text-center">
            Cette offre expire à la fin du Ramadan.
          </p>
        </section>

        {/* Badge prix le plus bas */}
        <div className="flex justify-center mb-3">
          <span className="inline-flex rounded-full bg-violet-600/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            Prix le plus bas
          </span>
        </div>

        {/* Carte tarif annuel */}
        <section className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white">Annuel</p>
              <p className="text-xs text-white/60 mt-0.5">12 mois</p>
              <p className="text-sm text-white/50 line-through mt-1">
                {formatPrice(YEARLY_FULL)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {formatPrice(MONTHLY_EQUIVALENT)}
                <span className="text-base font-normal text-white/80">/mois</span>
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                {formatPrice(YEARLY_DISCOUNTED)} pour 12 mois
              </p>
            </div>
          </div>
        </section>

        {/* CTA principal */}
        <section className="mt-auto space-y-4 pt-2">
          <button
            type="button"
            onClick={handleClaim}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-4 text-base font-bold text-white shadow-lg hover:from-violet-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-400/60 active:opacity-90 transition-all"
          >
            Profiter de l&apos;offre
          </button>
          <p className="text-xs text-center text-white/70">
            Annulable à tout moment · Reprends le contrôle
          </p>
          <button
            type="button"
            onClick={() => {}}
            className="block w-full text-center text-sm text-white/60 hover:text-white/80 underline underline-offset-2 transition-colors"
          >
            Restaurer un achat
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <span className="font-medium text-white/50">StopHaram</span>
        </footer>
      </div>
    </main>
  );
}
