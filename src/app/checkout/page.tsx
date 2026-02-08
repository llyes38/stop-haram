"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateLastRoute } from "@/lib/authState";
import { getUser, saveUser } from "@/lib/storage";
import StopHaramLogo from "@/components/brand/StopHaramLogo";

// Tarifs : mensuel 9,99 € ; annuel -50 % Ramadan = 59,94 €/an = 4,99 €/mois
const MONTHLY_PRICE = 9.99;
const YEARLY_FULL = MONTHLY_PRICE * 12;
const DISCOUNT_PERCENT = 50;
const YEARLY_DISCOUNTED = (YEARLY_FULL * (100 - DISCOUNT_PERCENT)) / 100;
const MONTHLY_EQUIVALENT = Math.floor((YEARLY_DISCOUNTED / 12) * 100) / 100;

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",") + " €";
}

type Plan = "monthly" | "annual";

function SlideCommunity() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl bg-gradient-to-b from-[#1a0a2e] to-[#0f172a] border border-white/20 flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex items-end gap-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/40 border-2 border-emerald-400/60 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <div className="w-10 h-10 rounded-full bg-violet-500/40 border-2 border-violet-400/60 flex items-center justify-center -ml-2">
          <svg className="w-5 h-5 text-violet-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </div>
        <div className="w-14 h-14 rounded-full bg-cyan-500/40 border-2 border-cyan-400/60 flex items-center justify-center -ml-2">
          <svg className="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <span className="text-white/90 text-sm font-medium">Session en direct</span>
      </div>
      <p className="text-white/70 text-xs text-center max-w-[200px]">Rejoins un espace bienveillant</p>
    </div>
  );
}

function SlideProgress() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl bg-gradient-to-b from-[#1a0a2e] to-[#0f172a] border border-white/20 flex flex-col items-center justify-center gap-4 p-6">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <circle cx="18" cy="18" r="16" fill="none" stroke="url(#ringProg)" strokeWidth="3" strokeDasharray="75 100" strokeLinecap="round" />
          <defs><linearGradient id="ringProg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">90%</span>
      </div>
      <p className="text-white/90 text-sm font-semibold">Récupération · 80 jours</p>
      <div className="w-full max-w-[180px] h-2 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" />
      </div>
      <p className="text-white/60 text-xs">Visualise ta progression</p>
    </div>
  );
}

function SlideStreak() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl bg-gradient-to-b from-[#1a0a2e] to-[#0f172a] border border-white/20 flex flex-col items-center justify-center gap-4 p-6">
      <p className="text-white/60 text-xs font-medium">L M M J V S D</p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${i <= 5 ? "bg-emerald-500/40 text-emerald-300 border border-emerald-400/50" : "bg-white/10 text-white/50 border border-white/10"}`}>
            {i <= 5 ? "✓" : "—"}
          </div>
        ))}
      </div>
      <p className="text-white text-xl font-bold">14j 4h 23min</p>
      <p className="text-white/60 text-sm">Sans rechute</p>
      <div className="rounded-xl bg-violet-500/20 border border-violet-400/40 px-4 py-2.5 text-center">
        <p className="text-violet-200 text-xs font-semibold">Plus de discipline</p>
        <p className="text-white/60 text-[10px]">Chaque jour compte.</p>
      </div>
    </div>
  );
}

function SlideAllInOne() {
  return (
    <div className="w-full h-full min-h-[320px] rounded-2xl bg-gradient-to-b from-[#1a0a2e] to-[#0f172a] border border-white/20 flex flex-col items-center justify-center gap-4 p-6">
      <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
        {["Rappels", "Méditation", "Suivi", "Ressources"].map((label, i) => (
          <div key={i} className="rounded-xl bg-white/10 border border-white/15 py-3 flex flex-col items-center gap-1">
            <span className="text-white/90 text-xs font-medium">{label}</span>
            {i === 0 && <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            {i === 1 && <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            {i === 2 && <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            {i === 3 && <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-violet-500/20 border border-violet-400/30 px-4 py-2 text-center w-full max-w-[200px]">
        <p className="text-violet-200 text-xs font-semibold">Plus de sérénité</p>
        <p className="text-white/60 text-[10px]">Une seule app.</p>
      </div>
    </div>
  );
}

const SLIDE_CONTENT = [SlideCommunity, SlideProgress, SlideStreak, SlideAllInOne];

const SLIDES = [
  { title: "Trouve ta communauté", subtitle: "Rejoins un espace bienveillant pour avancer." },
  { title: "Suis tes progrès", subtitle: "Visualise ta progression au quotidien." },
  { title: "Garde ta série", subtitle: "Chaque jour compte. Ne lâche rien." },
  { title: "Tout en un lieu", subtitle: "Rappels, méditation, suivi. Une seule app." },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOffrir = searchParams.get("mode") === "offrir";
  const [slideIndex, setSlideIndex] = useState(0);
  const [plan, setPlan] = useState<Plan>("annual");

  const goToSlide = useCallback((index: number) => {
    setSlideIndex((Math.max(0, Math.min(index, SLIDES.length - 1))));
  }, []);

  useEffect(() => {
    updateLastRoute("/checkout");
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handlePay = async () => {
    const forfait: "mensuel" | "annuel" = plan === "annual" ? "annuel" : "mensuel";
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_forfait", forfait);
      window.sessionStorage.setItem("stopharam_from_checkout", "true");
      const u = getUser();
      if (u) {
        u.profileInfo = { ...u.profileInfo, forfait };
        saveUser(u);
      }
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan === "annual" ? "annual" : "monthly",
          ...(isOffrir && { mode: "offrir" }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (_e) {
      /* fallback */
    }
    router.push("/success?session_id=dev");
  };

  return (
    <main className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#1a0a2e] via-[#0f172a] to-[#050818] text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/40" />
        <span className="absolute top-[20%] left-[88%] h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="absolute top-[40%] left-[12%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute top-[65%] left-[82%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[85%] left-[20%] h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-[420px] mx-auto w-full px-5 pt-6 pb-8">
        <header className="flex items-center justify-between mb-2">
          <StopHaramLogo size={120} variant="dark" className="block" />
          <div className="flex items-center gap-2">
            {isOffrir && (
              <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-emerald-200 text-xs font-semibold">
                Offrir
              </span>
            )}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
              aria-label="Fermer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </header>

        {/* Carousel */}
        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-center text-white mb-4">
            {SLIDES[slideIndex].title}
          </h2>
          <div className="relative mx-auto w-full max-w-[280px] mb-4 rounded-2xl overflow-hidden shadow-xl">
            {(() => {
              const SlideComponent = SLIDE_CONTENT[slideIndex];
              return <SlideComponent />;
            })()}
          </div>
          <p className="text-sm text-white/80 text-center mb-4">
            {SLIDES[slideIndex].subtitle}
          </p>
          <div className="flex justify-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === slideIndex ? "w-6 bg-white/90" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Badge économie (masqué en mode offrir) */}
        {!isOffrir && (
          <div className="flex justify-center mb-3">
            <span className="inline-flex rounded-full bg-violet-600/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
              Économise 50 %
            </span>
          </div>
        )}

        {/* Choix mensuel / annuel (ou 1 mois gratuit / annuel en mode offrir) */}
        <section className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => setPlan("annual")}
            className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-all ${
              plan === "annual"
                ? "border-violet-400 bg-violet-500/20"
                : "border-white/15 bg-white/5 hover:border-white/25"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{isOffrir ? "Offre annuelle" : "Annuel"}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  {isOffrir ? "12 mois pour ton proche" : `12 mois · ${formatPrice(YEARLY_DISCOUNTED)}`}
                </p>
              </div>
              {!isOffrir && (
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{formatPrice(MONTHLY_EQUIVALENT)}<span className="text-sm font-normal text-white/80">/mois</span></p>
                  <p className="text-xs text-emerald-400/90 mt-0.5">-50 % Ramadan</p>
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPlan("monthly")}
            className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-all ${
              plan === "monthly"
                ? "border-violet-400 bg-violet-500/20"
                : "border-white/15 bg-white/5 hover:border-white/25"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{isOffrir ? "1 mois gratuit" : "Mensuel"}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  {isOffrir ? "Offre 1 mois pour un proche" : "Résiliable à tout moment"}
                </p>
              </div>
              {!isOffrir && (
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{formatPrice(MONTHLY_PRICE)}<span className="text-sm font-normal text-white/80">/mois</span></p>
                </div>
              )}
            </div>
          </button>
        </section>

        {/* CTA */}
        <section className="mt-auto space-y-3 pt-2">
          {isOffrir && (
            <p className="text-emerald-200/90 text-sm text-center">
              Tu offres StopHaram à un proche — celui qui participe à une bonne œuvre aura la même récompense.
            </p>
          )}
          <button
            type="button"
            onClick={handlePay}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-4 text-base font-bold text-white shadow-lg hover:from-violet-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-400/60 active:opacity-90 transition-all"
          >
            {isOffrir
              ? plan === "annual"
                ? "Offrir l'offre annuelle"
                : "Offrir 1 mois gratuit"
              : plan === "annual"
              ? "Profiter de l'offre annuelle"
              : "S'abonner mensuellement"}
          </button>
          <p className="text-xs text-center text-white/70">
            Annulable à tout moment · Paiement sécurisé
          </p>
          <button
            type="button"
            onClick={() => {}}
            className="block w-full text-center text-sm text-white/60 hover:text-white/80 underline underline-offset-2 transition-colors"
          >
            Restaurer un achat
          </button>
        </section>
      </div>
    </main>
  );
}
