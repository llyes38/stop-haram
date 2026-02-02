"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const bgStyle = {
  background:
    "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
};

const stars = (
  <div className="absolute inset-0 pointer-events-none" aria-hidden>
    <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
    <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
    <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
    <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[45%] left-[15%] w-1 h-1 rounded-full bg-white/25" />
    <span className="absolute top-[55%] left-[80%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[65%] left-[25%] w-1 h-1 rounded-full bg-white/25" />
  </div>
);

const SYMPTOMS = [
  {
    category: "Mental",
    items: [
      { id: "mental_motivation", text: "Manque de motivation" },
      { id: "mental_concentration", text: "Difficulté à se concentrer" },
      { id: "mental_brain_fog", text: "Esprit embrouillé (brouillard mental)" },
      { id: "mental_anxiety", text: "Anxiété ou stress" },
      { id: "mental_guilt", text: "Culpabilité qui revient souvent" },
      { id: "mental_loss_control", text: "Perte de contrôle (je replonge sans réfléchir)" },
    ],
  },
  {
    category: "Habitudes",
    items: [
      { id: "habits_alone", text: "Je le fais surtout quand je suis seul" },
      { id: "habits_boredom", text: "Je le fais par ennui" },
      { id: "habits_evening", text: "Je craque surtout le soir" },
      { id: "habits_phone", text: "Je passe trop de temps sur le téléphone" },
      { id: "habits_procrastination", text: "Je repousse des choses importantes (procrastination)" },
      { id: "habits_double_life", text: "Je cache ce que je fais (double vie)" },
    ],
  },
  {
    category: "Social",
    items: [
      { id: "social_isolation", text: "Je m'isole plus qu'avant" },
      { id: "social_less_social", text: "Moins envie de voir les gens" },
      { id: "social_confidence", text: "Baisse de confiance en moi" },
      { id: "social_present", text: "Je me sens moins 'présent' avec les autres" },
      { id: "social_comparison", text: "Je compare trop ma vie à celle des autres" },
    ],
  },
  {
    category: "Foi",
    items: [
      { id: "faith_far_from_allah", text: "Je me sens loin d'Allah" },
      { id: "faith_prayer_energy", text: "Je manque d'énergie pour prier" },
      { id: "faith_delay_prayer", text: "Je retarde la prière" },
      { id: "faith_give_up", text: "Je fais des efforts puis je lâche" },
      { id: "faith_shame", text: "J'ai honte de revenir vers Allah après une rechute" },
    ],
  },
  {
    category: "Corps / Énergie",
    items: [
      { id: "body_fatigue", text: "Fatigue ou manque d'énergie" },
      { id: "body_sleep", text: "Sommeil déréglé" },
      { id: "body_morning", text: "Difficulté à se lever le matin" },
      { id: "body_tension", text: "Tensions / nervosité" },
      { id: "body_dopamine", text: "Recherche rapide de plaisir (dopamine)" },
    ],
  },
];

export default function SymptomsPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("stopharam_symptoms");
    if (saved) {
      setSelectedSymptoms(JSON.parse(saved));
    }
  }, []);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("stopharam_symptoms", JSON.stringify(newSelection));
      }
      return newSelection;
    });
  };

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_symptoms", JSON.stringify(selectedSymptoms));
    }
    router.push("/awareness");
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-10 pb-24 relative overflow-hidden"
      style={bgStyle}
    >
      {stars}

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-white/80 hover:text-white focus:outline-none transition-colors"
            aria-label="Retour"
          >
            <svg
              width="24"
              height="24"
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
          <h1 className="text-white text-2xl font-bold">Symptômes</h1>
        </div>

        {/* Bandeau intro */}
        <div className="bg-orange-500/90 rounded-2xl p-4 mb-6">
          <p className="text-white text-base font-medium leading-relaxed">
            Face à un péché ou une mauvaise habitude, des signes apparaissent souvent
            : fatigue, culpabilité, isolement… Parmi la liste ci-dessous, coche ceux
            qui correspondent à ce que tu vis.
          </p>
        </div>

        {/* Sous-titre */}
        <p className="text-white text-base font-medium mb-4">
          Coche toutes les propositions qui te parlent :
        </p>

        {/* Liste des symptômes par catégorie */}
        <div className="space-y-6 mb-32">
          {SYMPTOMS.map((category) => (
            <div key={category.category} className="space-y-3">
              <h2 className="text-white text-lg font-semibold">
                {category.category}
              </h2>
              {category.items.map((item) => {
                const isSelected = selectedSymptoms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSymptom(item.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "bg-orange-500/30 border-orange-400/60 text-white"
                        : "bg-white/5 border-white/20 text-white/90 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    {/* Check circle */}
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-orange-500 border-orange-500"
                          : "border-white/40 bg-transparent"
                      }`}
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
                    </div>
                    <span className="flex-1 text-base">{item.text}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-white/60 text-xs text-center leading-relaxed mb-4">
          *Ces indications sont à titre informatif et ne remplacent pas un avis
          médical.
        </p>
      </div>

        {/* CTA Sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1f12] via-[#0a1f12]/95 to-transparent pt-8 pb-6 px-6 z-20">
        <div className="w-full max-w-[420px] mx-auto">
          {selectedSymptoms.length === 0 ? (
            <p className="text-amber-300/90 text-sm text-center mb-3">
              Sélectionne au moins un symptôme pour continuer.
            </p>
          ) : (
            <p className="text-white/70 text-sm text-center mb-3">
              Tu pourras modifier plus tard.
            </p>
          )}
          <button
            onClick={handleContinue}
            disabled={selectedSymptoms.length === 0}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-semibold text-base shadow-lg hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
          >
            Rebooster ma foi
          </button>
        </div>
      </div>
    </main>
  );
}
