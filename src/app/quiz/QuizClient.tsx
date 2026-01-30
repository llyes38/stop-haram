"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ensureUserDefaults, getUser, saveUser, domainsToSins } from "@/lib/storage";
import { generatePlan } from "@/lib/programEngine";
import { updateLastRoute, setProfile } from "@/lib/authState";
import type { SelectedSin } from "@/lib/storage";

const GENDER_QUESTION = {
  id: "gender",
  text: "Tu es :",
  options: ["Un homme", "Une femme"],
  multiSelect: false,
};

const DOMAINS = [
  "Prière / retard / négligence",
  "Regards / contenu explicite",
  "Relations illicites",
  "Alcool / drogues",
  "Mensonge / double vie",
  "Colère / insultes",
  "Musique / temps perdu",
  "Réseaux sociaux / addiction téléphone",
  "Autre / je ne sais pas encore",
];

// Fonction pour convertir les péchés en domaines
const SIN_TO_DOMAIN: Record<SelectedSin, string> = {
  priere: "Prière / retard / négligence",
  regard: "Regards / contenu explicite",
  porno: "Relations illicites",
  drogue: "Alcool / drogues",
  mensonge: "Mensonge / double vie",
  colere: "Colère / insultes",
  musique: "Musique / temps perdu",
  jeux: "Réseaux sociaux / addiction téléphone",
  alcool: "Alcool / drogues",
  autre: "Autre / je ne sais pas encore",
};

function sinsToDomains(sins: SelectedSin[]): string[] {
  return sins.map((sin) => SIN_TO_DOMAIN[sin] || "").filter(Boolean);
}

const QUESTIONS = [
  { id: "q1", text: "À quelle fréquence tu retombes (tous domaines confondus) ?", options: ["Plusieurs fois par jour", "Une fois par jour", "Quelques fois par semaine", "Rarement"], multiSelect: false },
  { id: "q2", text: "Quand est-ce que ça arrive le plus souvent ?", options: ["Le soir", "Après une journée stressante", "Quand je suis seul", "Par ennui", "Après les réseaux sociaux"], multiSelect: true, maxChoices: 3 },
  { id: "q3", text: "Quel est le déclencheur principal ?", options: ["Stress / anxiété", "Solitude", "Ennui", "Habitude automatique", "Tentation extérieure (réseaux, amis, environnement)"], multiSelect: true, maxChoices: 3 },
  { id: "q4", text: "Depuis combien de temps tu luttes avec ça ?", options: ["Moins de 6 mois", "6 à 12 mois", "1 à 3 ans", "Plus de 3 ans"], multiSelect: false },
  { id: "q5", text: "Qu'est-ce qui t'empêche le plus d'arrêter ?", options: ["Manque de plan", "Je craque trop vite", "Je culpabilise puis je recommence", "Je suis entouré de tentations", "Je n'arrive pas à tenir quand je suis seul"], multiSelect: true, maxChoices: 3 },
  { id: "q6", text: "Après être retombé, tu te sens plutôt…", options: ["Coupable", "Vide / triste", "En colère contre moi", "Indifférent", "Motivé à changer"], multiSelect: false },
  { id: "q7", text: "Ton objectif principal avec StopHaram est de :", options: ["Arrêter complètement", "Réduire fortement", "Reprendre le contrôle", "Progresser spirituellement", "Mieux gérer mes émotions"], multiSelect: false },
  { id: "q8", text: "Qu'est-ce que tu as déjà essayé pour arrêter ?", options: ["Rien de sérieux jusqu'à maintenant", "J'ai essayé seul, sans méthode", "J'ai tenu quelques jours / semaines", "J'ai déjà suivi des conseils ou un programme", "J'ai déjà rechuté plusieurs fois malgré mes efforts"], multiSelect: false },
  { id: "q9", text: "Si rien ne change, comment vois-tu la situation dans 1 an ?", options: ["Ça ira mieux naturellement", "Ce sera pareil", "Ce sera probablement pire", "J'ai peur que ça prenne plus de place dans ma vie", "Je préfère ne pas y penser"], multiSelect: false },
  { id: "q10", text: "Qu'est-ce qui t'aiderait vraiment à tenir sur la durée ?", options: ["Des rappels simples", "Un cadre clair et progressif", "Un suivi quotidien", "Un accompagnement discret et bienveillant", "Je ne sais pas encore"], multiSelect: true, maxChoices: 3 },
];

const totalSteps = 12;

const bgStyle = {
  background: "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
};

const stars = (
  <div className="absolute inset-0 pointer-events-none" aria-hidden>
    <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
    <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
    <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
    <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
    <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
  </div>
);

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [tempMultiSelect, setTempMultiSelect] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState("");

  const saveToLocalStorage = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("stopharam_quiz", JSON.stringify(answers));
    window.localStorage.setItem("stopharam_domains", JSON.stringify(selectedDomains));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const from = searchParams.get("from");
    if (from === "analysis") {
      setCurrentStep(11);
      router.replace("/quiz");
    }
    
    // Si on vient de parcours ou companion, charger les données utilisateur existantes
    if (from === "parcours" || from === "companion") {
      const existingUser = getUser();
      if (existingUser) {
        // Pré-remplir les domaines avec les péchés actuels
        const domains = sinsToDomains(existingUser.selectedSins);
        setSelectedDomains(domains);
        
        // Pré-remplir les réponses du quiz
        if (existingUser.answers) {
          setAnswers(existingUser.answers as Record<string, string | string[]>);
        }
        
        // Pré-remplir nom et âge depuis le profil
        setFirstName(existingUser.name || "");
        if (existingUser.profileInfo?.age) {
          setAge(String(existingUser.profileInfo.age));
        }
        
        // Commencer directement à l'étape de sélection des domaines
        setCurrentStep(1);
      }
      return;
    }
    
    const savedQuiz = window.localStorage.getItem("stopharam_quiz");
    const savedDomains = window.localStorage.getItem("stopharam_domains");
    const savedProfile = window.localStorage.getItem("stopharam_profile");
    if (savedQuiz) setAnswers(JSON.parse(savedQuiz));
    if (savedDomains) setSelectedDomains(JSON.parse(savedDomains));
    if (savedProfile) {
      const p = JSON.parse(savedProfile) as { firstName?: string; age?: number };
      setFirstName(p.firstName ?? "");
      setAge(String(p.age ?? ""));
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (currentStep >= 2 && currentStep <= 11) {
      const q = QUESTIONS[currentStep - 2];
      if (q?.multiSelect && answers[q.id]) {
        const prev = answers[q.id];
        setTempMultiSelect(Array.isArray(prev) ? [...prev] : []);
      } else {
        setTempMultiSelect([]);
      }
    } else {
      setTempMultiSelect([]);
    }
  }, [currentStep, answers]);

  const handleGenderAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, gender: option }));
  };

  const handleContinueGender = () => {
    if (!answers.gender) return;
    saveToLocalStorage();
    setCurrentStep(1);
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleContinueFromDomains = () => {
    if (selectedDomains.length === 0) return;
    saveToLocalStorage();
    setCurrentStep(2);
  };

  const handleMultiSelectToggle = (option: string) => {
    const selected = Array.isArray(tempMultiSelect) ? tempMultiSelect : [];
    if (selected.includes(option)) {
      setTempMultiSelect(selected.filter((o) => o !== option));
    } else {
      setTempMultiSelect([...selected, option]);
    }
  };

  const handleContinueMultiSelect = () => {
    if (tempMultiSelect.length === 0) return;
    const question = QUESTIONS[currentStep - 2];
    if (!question) return;
    const newAnswers = { ...answers, [question.id]: [...tempMultiSelect] };
    setAnswers(newAnswers);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_quiz", JSON.stringify(newAnswers));
      window.localStorage.setItem("stopharam_domains", JSON.stringify(selectedDomains));
    }
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleAnswer = (option: string) => {
    const question = QUESTIONS[currentStep - 2];
    if (!question) return;
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stopharam_quiz", JSON.stringify(newAnswers));
      window.localStorage.setItem("stopharam_domains", JSON.stringify(selectedDomains));
    }
  };

  const handleContinueSingleChoice = () => {
    const question = QUESTIONS[currentStep - 2];
    if (!question || !answers[question.id]) return;
    saveToLocalStorage();
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const goPrevious = () => {
    // Si on vient de parcours, ne pas permettre de revenir à step 0
    if (currentStep > (fromParcours ? 1 : 0)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fromAccount = searchParams.get("from") === "account";
  const fromParcours = searchParams.get("from") === "parcours";
  const fromCompanion = searchParams.get("from") === "companion";

  const handleBack = () => {
    if (currentStep > 0) {
      if (fromParcours && currentStep === 1) {
        router.push("/parcours");
        return;
      }
      if (fromCompanion && currentStep === 1) {
        router.push("/home");
        return;
      }
      goPrevious();
    } else {
      if (fromAccount) router.push("/account");
      else if (fromParcours) router.push("/parcours");
      else if (fromCompanion) router.push("/home");
      else router.push("/");
    }
  };

  const handleSkip = () => router.push("/profile");

  const handleFinishQuiz = () => {
    let profile = { firstName: firstName.trim(), age: parseInt(age, 10) };
    if (typeof window !== "undefined") {
      const savedProfile = window.localStorage.getItem("stopharam_profile");
      if (savedProfile && (!profile.firstName || isNaN(profile.age))) {
        try {
          const p = JSON.parse(savedProfile) as { firstName?: string; age?: number };
          if (!profile.firstName && p.firstName) profile = { ...profile, firstName: p.firstName };
          if (isNaN(profile.age) && typeof p.age === "number") profile = { ...profile, age: p.age };
        } catch {}
      }
      if (!fromParcours && !fromCompanion) {
        window.localStorage.setItem("stopharam_profile", JSON.stringify(profile));
      }
      updateLastRoute("/quiz");
      const selectedSins = domainsToSins(selectedDomains);
      const scores: Record<string, number> = {};
      selectedSins.forEach((sin) => { scores[sin] = 50; });
      const existingUser = getUser();
      const isModifyFromAccount = searchParams.get("from") === "account";
      const isModifyFromParcours = searchParams.get("from") === "parcours";
      const isModifyFromCompanion = searchParams.get("from") === "companion";
      const isModify = isModifyFromAccount || isModifyFromParcours || isModifyFromCompanion;
      
      let user;
      if (isModify && existingUser) {
        // Conserver toutes les données existantes, juste mettre à jour les péchés et réponses
        user = ensureUserDefaults({
          ...existingUser,
          name: (isModifyFromParcours || isModifyFromCompanion) ? existingUser.name : (profile.firstName || existingUser.name),
          selectedSins,
          scores: { ...existingUser.scores, ...scores },
          answers: answers as Record<string, unknown>,
        });
      } else {
        user = ensureUserDefaults({
          name: profile.firstName || "Utilisateur",
          selectedSins,
          scores,
          answers: answers as Record<string, unknown>,
          startDateISO: new Date().toISOString().slice(0, 10),
          streakDays: 0,
        });
      }
      user.plan = generatePlan(user);
      saveUser(user);
      
      if (isModifyFromAccount) {
        setProfile({ name: user.name });
        router.replace("/account");
        return;
      }
      if (isModifyFromParcours) {
        router.replace("/parcours");
        return;
      }
      if (isModifyFromCompanion) {
        router.replace("/home");
        return;
      }
    }
    router.push("/analysis");
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-6 pb-8 relative overflow-hidden"
      style={bgStyle}
    >
      {stars}
      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        {/* Progress bar */}
        <div className="h-1 rounded-full bg-white/10 mb-4">
          <div
            className="h-full rounded-full bg-teal-400/80 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header: Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="text-white/80 hover:text-white focus:outline-none flex items-center gap-2"
            aria-label="Retour"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Retour</span>
          </button>
        </div>

        {/* Step 0: Gender - sautée si on vient de parcours */}
        {currentStep === 0 && !fromParcours && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">{GENDER_QUESTION.text}</h2>
            <div className="space-y-3 mb-6">
              {GENDER_QUESTION.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleGenderAnswer(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                    answers.gender === opt ? "bg-white/20 border-teal-400/60 text-white" : "bg-white/5 border-white/20 text-white/90 hover:border-white/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={handleContinueGender}
              disabled={!answers.gender}
              className={`w-full py-3.5 rounded-xl font-semibold text-base ${
                answers.gender ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Step 1: Domains */}
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Sur quoi veux-tu travailler en priorité ?</h2>
            <p className="text-white/80 text-sm mb-4">Tu peux en choisir un ou plusieurs.</p>
            <div className="space-y-3 mb-6">
              {DOMAINS.map((d) => (
                <label
                  key={d}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedDomains.includes(d) ? "bg-white/20 border-teal-400/60" : "bg-white/5 border-white/20 hover:border-white/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDomains.includes(d)}
                    onChange={() => handleDomainToggle(d)}
                    className="rounded border-white/40 text-teal-500"
                  />
                  <span className="text-white/95">{d}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleContinueFromDomains}
              disabled={selectedDomains.length === 0}
              className={`w-full py-3.5 rounded-xl font-semibold text-base ${
                selectedDomains.length > 0 ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Steps 2–11: Questions */}
        {currentStep >= 2 && currentStep <= 11 && (() => {
          const question = QUESTIONS[currentStep - 2];
          if (!question) return null;
          const questionNum = currentStep - 1;
          const totalQuestions = QUESTIONS.length;
          const isMulti = question.multiSelect;
          const currentVal = answers[question.id] as string | string[] | undefined;
          const multiSelected: string[] = isMulti ? (Array.isArray(tempMultiSelect) ? tempMultiSelect : []) : [];

          return (
            <div className="flex-1 flex flex-col">
              <p className="text-white/70 text-sm font-medium mb-2">
                Question {questionNum} / {totalQuestions}
              </p>
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">{question.text}</h2>
              <div className="space-y-3 mb-6">
                {question.options.map((opt) => (
                  isMulti ? (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                        multiSelected.includes(opt) ? "bg-white/20 border-teal-400/60" : "bg-white/5 border-white/20 hover:border-white/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={multiSelected.includes(opt)}
                        onChange={() => handleMultiSelectToggle(opt)}
                        className="rounded border-white/40 text-teal-500"
                      />
                      <span className="text-white/95">{opt}</span>
                    </label>
                  ) : (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        currentVal === opt
                          ? "bg-teal-500/30 border-teal-400 text-white ring-2 ring-teal-400/50 ring-offset-2 ring-offset-transparent"
                          : "bg-white/5 border-white/20 text-white/90 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                ))}
              </div>
              <button
                onClick={isMulti ? handleContinueMultiSelect : handleContinueSingleChoice}
                disabled={isMulti ? multiSelected.length === 0 : !currentVal}
                className={`w-full py-3.5 rounded-xl font-semibold text-base ${
                  (isMulti ? multiSelected.length > 0 : !!currentVal)
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Continuer
              </button>
            </div>
          );
        })()}

        {/* Skip test */}
        {currentStep < 12 && (
          <div className="mt-auto pt-6">
            <Link
              href="/profile"
              className="block text-center text-white/60 text-sm hover:text-white/90 focus:outline-none focus:underline"
            >
              Skip test
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
