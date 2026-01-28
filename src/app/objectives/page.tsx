"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Objective = {
  id: string;
  label: string;
  icon: string;
  color: string;
  ring: string;
  fill: string;
};

const OBJECTIVES: Objective[] = [
  {
    id: "relations",
    label: "Relations plus fortes",
    icon: "❤️",
    color: "bg-red-500/20 border-red-400/40",
    ring: "ring-red-400/50",
    fill: "bg-red-500",
  },
  {
    id: "confiance",
    label: "Confiance en soi améliorée",
    icon: "👤",
    color: "bg-blue-500/20 border-blue-400/40",
    ring: "ring-blue-400/50",
    fill: "bg-blue-500",
  },
  {
    id: "humeur",
    label: "Humeur et paix intérieure",
    icon: "😊",
    color: "bg-amber-500/20 border-amber-400/40",
    ring: "ring-amber-400/50",
    fill: "bg-amber-500",
  },
  {
    id: "energie",
    label: "Plus d'énergie et de motivation",
    icon: "⚡",
    color: "bg-orange-500/20 border-orange-400/40",
    ring: "ring-orange-400/50",
    fill: "bg-orange-500",
  },
  {
    id: "maitrise",
    label: "Maîtrise de soi améliorée",
    icon: "🧠",
    color: "bg-cyan-500/20 border-cyan-400/40",
    ring: "ring-cyan-400/50",
    fill: "bg-cyan-500",
  },
  {
    id: "concentration",
    label: "Concentration et clarté",
    icon: "🎯",
    color: "bg-violet-500/20 border-violet-400/40",
    ring: "ring-violet-400/50",
    fill: "bg-violet-500",
  },
  {
    id: "pensees",
    label: "Pensées pures et saines",
    icon: "✨",
    color: "bg-emerald-500/20 border-emerald-400/40",
    ring: "ring-emerald-400/50",
    fill: "bg-emerald-500",
  },
  {
    id: "allah",
    label: "Lien avec Allah renforcé",
    icon: "🕌",
    color: "bg-teal-500/20 border-teal-400/40",
    ring: "ring-teal-400/50",
    fill: "bg-teal-500",
  },
];

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1628 0%, #0d1f35 25%, #0f2438 50%, #0d2835 75%, #0a1c2e 100%)",
};

export default function ObjectivesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("stopharam_objectives");
    if (raw) {
      try {
        const ids = JSON.parse(raw) as string[];
        if (Array.isArray(ids)) setSelected(ids);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_objectives", JSON.stringify(next));
    }
  };

  const handleFollow = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_objectives", JSON.stringify(selected));
    }
    router.push("/quiz");
  };

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
          Choisis tes objectifs
        </h1>
        <div className="w-10 shrink-0" aria-hidden />
      </header>

      {/* Intro */}
      <div className="relative z-0 mx-auto w-full max-w-[420px] px-4 pb-4">
        <p className="text-center text-sm leading-relaxed text-white/80">
          Sélectionne les objectifs que tu souhaites suivre pendant ton parcours.
        </p>
      </div>

      {/* Liste scrollable */}
      <div className="relative z-0 min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto max-w-[420px] space-y-3">
          {OBJECTIVES.map((obj) => {
            const isSelected = selected.includes(obj.id);
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => toggle(obj.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all ${obj.color} ${isSelected ? `ring-2 ${obj.ring}` : "hover:border-white/30"}`}
              >
                <span className="text-2xl" aria-hidden>
                  {obj.icon}
                </span>
                <span className="flex-1 font-medium text-white">
                  {obj.label}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? `${obj.fill} border-transparent` : "border-white/50 bg-transparent"
                  }`}
                  aria-hidden
                >
                  {isSelected && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA fixe */}
      <div className="relative z-10 flex w-full justify-center border-t border-white/10 bg-gradient-to-t from-[#0a1628] to-transparent px-4 py-4">
        <button
          type="button"
          onClick={handleFollow}
          className="flex w-full max-w-[320px] items-center justify-center rounded-2xl bg-white py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 active:bg-gray-200"
        >
          Suivre ces objectifs
        </button>
      </div>
    </main>
  );
}
