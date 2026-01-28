"use client";

import { useRouter } from "next/navigation";
import { setAuth, setState } from "@/lib/authState";

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 25%, #064e3b 50%, #0f2d22 75%, #022c22 100%)",
};

export default function StartEntreePage() {
  const router = useRouter();

  const handleCommencer = () => {
    setAuth({ isLoggedIn: true });
    setState({
      onboardingComplete: false,
      lastRoute: undefined,
      startDate: undefined,
      dayCount: 0,
      relapse: undefined,
    });
    router.push("/profile");
  };

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-hidden text-white"
      style={bgStyle}
    >
      {/* Ciel étoilé */}
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

      {/* Lune */}
      <div
        className="absolute right-1/4 top-[18%] h-16 w-16 rounded-full bg-white/95 shadow-[0_0_40px_rgba(167,243,208,0.35)]"
        aria-hidden
      />

      {/* Montagnes stylisées (tons verts) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[45%]" aria-hidden>
        <div
          className="absolute bottom-0 h-full w-[120%] -translate-x-[10%] rounded-t-[50%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(6,78,59,0.9) 30%, rgba(2,44,34,0.95) 100%)" }}
        />
        <div
          className="absolute bottom-0 h-[70%] w-[80%] translate-x-[5%] rounded-t-[45%]"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(15,45,34,0.7) 20%, rgba(4,47,46,0.9) 100%)" }}
        />
      </div>

      {/* Reflet eau (bande en bas, ton vert) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[20%]"
        style={{
          background: "linear-gradient(0deg, rgba(20,184,166,0.2) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Contenu */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-14 pb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Bienvenue !
        </h1>
        <p className="mt-3 max-w-[320px] text-base leading-relaxed text-white/95 sm:text-lg">
          Commençons par mieux te connaître pour t&apos;accompagner pas à pas.
        </p>

        {/* Élément décoratif : étoiles + lauriers */}
        <div className="mt-8 flex items-center gap-2">
          <svg
            className="h-7 w-7 text-amber-400/80"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
          </svg>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-amber-400/90"
                aria-hidden
              />
            ))}
          </div>
          <svg
            className="h-7 w-7 scale-x-[-1] text-amber-400/80"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
          </svg>
        </div>

        {/* Boutons en bas */}
        <div className="mt-auto flex max-w-[420px] flex-col gap-3 pt-12">
          <button
            type="button"
            onClick={handleCommencer}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Commencer
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-2xl border border-white/30 bg-white/10 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Déjà client
          </button>
        </div>
      </div>

      {/* Indicateur de page */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
      </div>
    </main>
  );
}
