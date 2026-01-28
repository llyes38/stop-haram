"use client";

import { useRouter } from "next/navigation";

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0a1c2e 100%)",
};

export default function StartSplashPage() {
  const router = useRouter();

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-12 text-white"
      style={bgStyle}
    >
      {/* Logo StopHaram avec effet miroir (reflection) */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            StopHaram
          </h1>
          {/* Reflet miroir sous le logo */}
          <h1
            className="mt-0.5 text-4xl sm:text-5xl font-bold tracking-tight opacity-30"
            style={{
              transform: "scaleY(-1)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
              maskImage: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            }}
            aria-hidden
          >
            StopHaram
          </h1>
        </div>

        {/* Tagline */}
        <p className="mt-6 max-w-[280px] text-center text-base leading-relaxed text-white/95 sm:text-lg">
          Un pas à la fois.
          <br />
          Réfléchir avant de rechuter.
        </p>

        {/* Élément décoratif : lauriers + étoiles */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <svg
            className="h-8 w-8 text-amber-400/80"
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
                className="h-2 w-2 rounded-full bg-amber-400/90"
                aria-hidden
              />
            ))}
          </div>
          <svg
            className="h-8 w-8 scale-x-[-1] text-amber-400/80"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l1.5 4.5L18 8l-3.5 2.5L16 15l-4-2.5L8 15l1.5-4.5L6 8l4.5-1.5L12 2z" />
          </svg>
        </div>

        {/* Sous-titre */}
        <p className="mt-8 text-sm font-medium tracking-wide text-white/70">
          Un accompagnement discret et bienveillant
        </p>

        {/* Bouton Suivant */}
        <button
          type="button"
          onClick={() => router.push("/start/entree")}
          className="mt-12 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Suivant
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
      </div>

      {/* Indicateur de page (point en bas) */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden />
      </div>
    </main>
  );
}
