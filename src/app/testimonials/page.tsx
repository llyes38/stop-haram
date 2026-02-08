"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PAID_KEY = "stopharam_paid";

type Entry = {
  type: "scholar" | "user";
  name: string;
  title: string;
  body: string;
};

const ENTRIES: Entry[] = [
  {
    type: "scholar",
    name: "Les savants",
    title: "La constance purifie le cœur.",
    body: "La constance dans l'effort, même modeste, purifie le cœur et renforce la volonté. Mieux vaut peu et régulier que beaucoup sans suite.",
  },
  {
    type: "scholar",
    name: "Les savants",
    title: "Fermer les portes du mal avant d'y entrer.",
    body: "Il est plus facile de fuir la tentation au début que de lutter une fois qu'elle a frappé. Protéger les causes est plus efficace que combattre après.",
  },
  {
    type: "scholar",
    name: "Les savants",
    title: "Chaque retour compte.",
    body: "Allah ouvre toujours une porte à celui qui revient. La repentance efface ce qui précède. Ne te décourage pas.",
  },
  {
    type: "user",
    name: "Karim",
    title: "J'ai repris le contrôle.",
    body: "Depuis que je fais ma muhasabah, je retarde moins la prière et je sens mon cœur plus léger. Discret et bienveillant.",
  },
  {
    type: "user",
    name: "Youssef",
    title: "Un pas chaque jour.",
    body: "La régularité m'a aidé plus que les grands élans. StopHaram me rappelle mon intention sans me juger.",
  },
  {
    type: "user",
    name: "Anonyme",
    title: "Plus présent avec les miens.",
    body: "Je suis plus disponible pour ma famille et mes amis. Les petites choses du quotidien ont repris du sens.",
  },
];

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1628 0%, #0d1f35 25%, #0f2438 50%, #0d2835 75%, #0a1c2e 100%)",
};

export default function TestimonialsPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem(PAID_KEY) === "true") {
      router.replace("/app");
    }
  }, [router]);

  return (
    <main
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
      style={bgStyle}
    >
      {/* Texture étoiles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute top-[10%] left-[8%] h-1 w-1 rounded-full bg-white/35" />
        <span className="absolute top-[15%] left-[85%] h-1 w-1 rounded-full bg-white/30" />
        <span className="absolute top-[28%] left-[18%] h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="absolute top-[6%] left-[52%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute top-[24%] left-[92%] h-1 w-1 rounded-full bg-white/28" />
        <span className="absolute top-[45%] left-[5%] h-1 w-1 rounded-full bg-white/20" />
        <span className="absolute top-[55%] left-[88%] h-1 w-1 rounded-full bg-white/22" />
        <span className="absolute top-[72%] left-[12%] h-1 w-1 rounded-full bg-white/25" />
        <span className="absolute top-[80%] left-[78%] h-1.5 w-1.5 rounded-full bg-white/28" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex min-h-[56px] w-full max-w-[420px] items-center gap-3 px-4 py-3 mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Retour"
        >
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-white">
          Paroles & témoignages
        </h1>
        <div className="w-10 shrink-0" aria-hidden />
      </header>

      {/* Liste scrollable */}
      <div className="relative z-0 min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto max-w-[420px] space-y-6 pt-2">
          {ENTRIES.map((entry, i) => (
            <div key={i} className="flex gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${entry.type === "scholar" ? "bg-amber-500/20 text-amber-200" : "bg-white/10 text-white"}`}
              >
                {entry.type === "scholar" ? "📿" : "SH"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white">
                    {entry.name}
                  </span>
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500"
                    aria-hidden
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[#1e3a5f]/95 px-4 py-3 shadow-lg border border-white/10">
                  <p className="mb-1.5 font-semibold leading-snug text-white">
                    {entry.title}
                  </p>
                  <p className="text-sm leading-relaxed text-white/90">
                    {entry.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA fixe */}
      <div className="relative z-10 flex w-full justify-center border-t border-white/10 bg-gradient-to-t from-[#0a1628] to-transparent px-4 py-4">
        <button
          type="button"
          onClick={() => router.push("/objectives")}
          className="flex w-full max-w-[320px] items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-gray-200"
        >
          Commencer mon parcours
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
    </main>
  );
}
