"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StopHaramLogo from "@/components/brand/StopHaramLogo";
import { setAuth, setState, isLoggedIn, isOnboardingComplete } from "@/lib/authState";
import { clearDecouverteSeen } from "@/lib/decouverteStorage";
import { resetTemptationStats } from "@/lib/temptationStats";
import { clearDefiDaysStatus } from "@/lib/defiDaysStatus";
import { activateFreeMonthFromLink } from "@/lib/pointsGratitude";
import { persistLocalStateToProgress } from "@/lib/progressStorage";

const bgStyle1 = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0a1c2e 100%)",
};

const bgStyle2 = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 25%, #064e3b 50%, #0f2d22 75%, #022c22 100%)",
};

export default function StartCarouselPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [freeMonthReceived, setFreeMonthReceived] = useState(false);

  useEffect(() => {
    const offer = searchParams.get("offer");
    if (offer && typeof offer === "string" && offer.length >= 4) {
      activateFreeMonthFromLink();
      setFreeMonthReceived(true);
    }
  }, [searchParams]);

  const goToSlide = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setSlideIndex(index);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setSlideIndex(Math.min(index, 1));
  };

  const handleCommencer = () => {
    // Déjà payé et parcours terminé → home
    if (isLoggedIn() && isOnboardingComplete()) {
      router.push("/home");
      return;
    }
    clearDecouverteSeen();
    resetTemptationStats();
    clearDefiDaysStatus();
    setAuth({ isLoggedIn: true });
    setState({
      onboardingComplete: false,
      lastRoute: undefined,
      startDate: undefined,
      dayCount: 0,
      relapse: undefined,
    });
    persistLocalStateToProgress(null);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_guest_mode", "true");
    }
    router.push("/profile");
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
      {/* Carousel scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        data-start-carousel
        className="flex h-[100dvh] w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth overscroll-contain"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
        }}
      >
        <style>{`
          [data-start-carousel]::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Slide 1 : Logo + effet miroir — scrollable sur petit écran pour voir le bouton Suivant */}
        <section
          className="relative flex min-h-full min-w-full shrink-0 snap-start snap-always flex-col items-center justify-center px-6 py-8 pb-28 text-white overflow-y-auto"
          style={bgStyle1}
          aria-label="Page 1 sur 2"
        >
          <div className="relative z-10 flex flex-col items-center text-center min-h-0 flex-1 justify-center">
            <div className="relative">
              <StopHaramLogo size={200} variant="dark" className="drop-shadow-lg" />
              <div
                className="mt-0.5 opacity-30"
                style={{
                  transform: "scaleY(-1)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                  maskImage: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                }}
                aria-hidden
              >
                <StopHaramLogo size={200} variant="dark" />
              </div>
            </div>
            <p className="mt-6 max-w-[280px] text-center text-base leading-relaxed text-white/95 sm:text-lg">
              Un pas à la fois.
              <br />
              Réfléchir avant de rechuter.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <svg className="h-8 w-8 text-amber-400/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
              </svg>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-amber-400/90" aria-hidden />
                ))}
              </div>
              <svg className="h-8 w-8 scale-x-[-1] text-amber-400/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
              </svg>
            </div>
            <p className="mt-6 text-sm font-medium tracking-wide text-white/70">
              Un accompagnement discret et bienveillant
            </p>
            <button
              type="button"
              onClick={() => goToSlide(1)}
              className="mt-8 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Suivant
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Slide 2 : Bienvenue — scrollable + padding bas pour ne pas tronquer les boutons sur mobile */}
        <section
          className="relative flex min-h-full min-w-full shrink-0 snap-start snap-always flex-col overflow-y-auto overflow-x-hidden text-white"
          style={bgStyle2}
          aria-label="Page 2 sur 2"
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 3 === 0 ? "2px" : "1px",
                  height: i % 3 === 0 ? "2px" : "1px",
                  top: `${8 + (i * 3) % 70}%`,
                  left: `${(i * 7) % 95}%`,
                  opacity: 0.3 + (i % 5) * 0.1,
                }}
              />
            ))}
          </div>
          <div className="absolute right-1/4 top-[18%] h-16 w-16 rounded-full bg-white/95 shadow-[0_0_40px_rgba(167,243,208,0.35)]" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%]" aria-hidden>
            <div className="absolute bottom-0 h-full w-[120%] -translate-x-[10%] rounded-t-[50%]" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(6,78,59,0.9) 30%, rgba(2,44,34,0.95) 100%)" }} />
            <div className="absolute bottom-0 h-[70%] w-[80%] translate-x-[5%] rounded-t-[45%]" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(15,45,34,0.7) 20%, rgba(4,47,46,0.9) 100%)" }} />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[20%]" style={{ background: "linear-gradient(0deg, rgba(20,184,166,0.2) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }} aria-hidden />

          <div className="relative z-30 flex flex-1 flex-col px-6 pt-10 pb-28 min-h-0">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Bienvenue !</h1>
            {freeMonthReceived && (
              <div className="mt-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3">
                <p className="text-emerald-200 font-semibold text-sm">🎁 1 mois gratuit activé !</p>
                <p className="text-white/90 text-xs mt-1">Un proche t&apos;a offert StopHaram. Profite bien de ton parcours.</p>
              </div>
            )}
            <p className={`max-w-[320px] text-base leading-relaxed text-white/95 sm:text-lg ${freeMonthReceived ? "mt-4" : "mt-3"}`}>
              Commençons par mieux te connaître pour t&apos;accompagner pas à pas.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <svg className="h-7 w-7 text-amber-400/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
              </svg>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400/90" aria-hidden />
                ))}
              </div>
              <svg className="h-7 w-7 scale-x-[-1] text-amber-400/80" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
              </svg>
            </div>
            <div className="mt-auto flex max-w-[420px] flex-col gap-3 pt-8 pb-6">
              <button
                type="button"
                onClick={handleCommencer}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Commencer le quizz
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Indicateur de page fixe en bas — au-dessus de la barre système mobile */}
      <div className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={() => goToSlide(0)}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${slideIndex === 0 ? "bg-white" : "bg-white/40"}`}
          aria-label="Aller à la page 1"
        />
        <button
          type="button"
          onClick={() => goToSlide(1)}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${slideIndex === 1 ? "bg-white" : "bg-white/40"}`}
          aria-label="Aller à la page 2"
        />
      </div>
    </div>
  );
}
