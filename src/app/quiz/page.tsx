"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Question gender
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

const QUESTIONS = [
  {
    id: "q1",
    text: "À quelle fréquence tu retombes (tous domaines confondus) ?",
    options: [
      "Plusieurs fois par jour",
      "Une fois par jour",
      "Quelques fois par semaine",
      "Rarement",
    ],
    multiSelect: false,
  },
  {
    id: "q2",
    text: "Quand est-ce que ça arrive le plus souvent ?",
    options: [
      "Le soir",
      "Après une journée stressante",
      "Quand je suis seul",
      "Par ennui",
      "Après les réseaux sociaux",
    ],
    multiSelect: true,
    maxChoices: 3,
  },
  {
    id: "q3",
    text: "Quel est le déclencheur principal ?",
    options: [
      "Stress / anxiété",
      "Solitude",
      "Ennui",
      "Habitude automatique",
      "Tentation extérieure (réseaux, amis, environnement)",
    ],
    multiSelect: true,
    maxChoices: 3,
  },
  {
    id: "q4",
    text: "Depuis combien de temps tu luttes avec ça ?",
    options: [
      "Moins de 6 mois",
      "6 à 12 mois",
      "1 à 3 ans",
      "Plus de 3 ans",
    ],
    multiSelect: false,
  },
  {
    id: "q5",
    text: "Qu'est-ce qui t'empêche le plus d'arrêter ?",
    options: [
      "Manque de plan",
      "Je craque trop vite",
      "Je culpabilise puis je recommence",
      "Je suis entouré de tentations",
      "Je n'arrive pas à tenir quand je suis seul",
    ],
    multiSelect: true,
    maxChoices: 3,
  },
  {
    id: "q6",
    text: "Après être retombé, tu te sens plutôt…",
    options: [
      "Coupable",
      "Vide / triste",
      "En colère contre moi",
      "Indifférent",
      "Motivé à changer",
    ],
    multiSelect: false,
  },
  {
    id: "q7",
    text: "Ton objectif principal avec StopHaram est de :",
    options: [
      "Arrêter complètement",
      "Réduire fortement",
      "Reprendre le contrôle",
      "Progresser spirituellement",
      "Mieux gérer mes émotions",
    ],
    multiSelect: false,
  },
  {
    id: "q8",
    text: "Qu'est-ce que tu as déjà essayé pour arrêter ?",
    options: [
      "Rien de sérieux jusqu'à maintenant",
      "J'ai essayé seul, sans méthode",
      "J'ai tenu quelques jours / semaines",
      "J'ai déjà suivi des conseils ou un programme",
      "J'ai déjà rechuté plusieurs fois malgré mes efforts",
    ],
    multiSelect: false,
  },
  {
    id: "q9",
    text: "Si rien ne change, comment vois-tu la situation dans 1 an ?",
    options: [
      "Ça ira mieux naturellement",
      "Ce sera pareil",
      "Ce sera probablement pire",
      "J'ai peur que ça prenne plus de place dans ma vie",
      "Je préfère ne pas y penser",
    ],
    multiSelect: false,
  },
  {
    id: "q10",
    text: "Qu'est-ce qui t'aiderait vraiment à tenir sur la durée ?",
    options: [
      "Des rappels simples",
      "Un cadre clair et progressif",
      "Un suivi quotidien",
      "Un accompagnement discret et bienveillant",
      "Je ne sais pas encore",
    ],
    multiSelect: true,
    maxChoices: 3,
  },
];

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Structure: 0=gender, 1=domaines, 2-11=questions (q1-q10), 12=profile
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [tempMultiSelect, setTempMultiSelect] = useState<string[]>([]);
  
  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileAge, setProfileAge] = useState("");
  const [profileErrors, setProfileErrors] = useState<{ name?: string; age?: string }>({});

  // Calculer le pourcentage de progression
  // Total: gender(0) + domaines(1) + 10 questions(2-11) + profile(12) = 13 étapes
  const totalSteps = 13;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedDomains = localStorage.getItem("stopharam_domains");
    const savedAnswers = localStorage.getItem("stopharam_quiz");
    
    if (savedDomains) {
      setSelectedDomains(JSON.parse(savedDomains));
    }
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);
      // Normaliser: multi => tableau [], single => string ""
      const normalized: Record<string, unknown> = { ...parsed };
      [GENDER_QUESTION.id, ...QUESTIONS.map((q) => q.id)].forEach((id) => {
        const q = id === "gender" ? GENDER_QUESTION : QUESTIONS.find((x) => x.id === id);
        if (!q) return;
        const v = parsed[id];
        if ("multiSelect" in q && q.multiSelect) {
          normalized[id] = Array.isArray(v) ? v : [];
        } else {
          normalized[id] = typeof v === "string" ? v : "";
        }
      });
      setAnswers(normalized as Record<string, any>);
      if (parsed.name) setProfileName(parsed.name);
      if (parsed.age) setProfileAge(String(parsed.age));
    }

    const fromAnalysis = searchParams.get("from") === "analysis";
    if (fromAnalysis) {
      setCurrentStep(11); // Dernière question (q10)
      router.replace("/quiz");
    }
  }, [searchParams, router]);

  // Réinitialiser tempMultiSelect quand on change de question
  useEffect(() => {
    if (currentStep >= 2 && currentStep <= 11) {
      const questionIndex = currentStep - 2; // currentStep 2 = QUESTIONS[0] (q1)
      const question = QUESTIONS[questionIndex];
      // Normaliser: toujours un tableau pour les questions multi
      const savedAnswer = answers[question.id];
      if (question.multiSelect) {
        // Vérifier que selected est bien un tableau
        const selected = Array.isArray(savedAnswer) ? savedAnswer : [];
        setTempMultiSelect(selected);
      } else {
        setTempMultiSelect([]);
      }
    } else {
      setTempMultiSelect([]);
    }
  }, [currentStep, answers]);

  // Sauvegarder toutes les réponses dans localStorage
  const saveToLocalStorage = () => {
    const allData = {
      ...answers,
      gender: answers.gender,
      name: profileName.trim(),
      age: profileAge ? parseInt(profileAge) : undefined,
    };
    localStorage.setItem("stopharam_quiz", JSON.stringify(allData));
    localStorage.setItem("stopharam_domains", JSON.stringify(selectedDomains));
  };

  // Répondre à la question gender
  const handleGenderAnswer = (answer: string) => {
    const newAnswers = { ...answers, gender: answer };
    setAnswers(newAnswers);
    saveToLocalStorage();
  };

  // Continuer après sélection gender
  const handleContinueGender = () => {
    if (answers.gender) {
      setCurrentStep(1); // Aller aux domaines
    }
  };

  // Sauvegarder les domaines
  const handleDomainToggle = (domain: string) => {
    const newDomains = selectedDomains.includes(domain)
      ? selectedDomains.filter((d) => d !== domain)
      : [...selectedDomains, domain];
    setSelectedDomains(newDomains);
    localStorage.setItem("stopharam_domains", JSON.stringify(newDomains));
  };

  // Continuer après sélection des domaines
  const handleContinueFromDomains = () => {
    if (selectedDomains.length > 0) {
      setCurrentStep(2); // Aller à la première question (q1)
    }
  };

  // Toggle une option pour question multi-choix
  const handleMultiSelectToggle = (option: string) => {
    const selected = Array.isArray(tempMultiSelect) ? tempMultiSelect : [];

    // Si l'option est déjà sélectionnée : la retirer
    if (selected.includes(option)) {
      setTempMultiSelect(selected.filter((o) => o !== option));
    } else {
      // Sinon : l'ajouter
      setTempMultiSelect([...selected, option]);
    }
  };

  // Continuer après sélection multi-choix
  const handleContinueMultiSelect = () => {
    if (tempMultiSelect.length === 0) return;

    const questionIndex = currentStep - 2;
    const question = QUESTIONS[questionIndex];
    const newAnswers = { ...answers, [question.id]: tempMultiSelect };
    setAnswers(newAnswers);
    saveToLocalStorage();

    if (currentStep < 11) {
      goNextQuestion();
    } else {
      // Fin des questions, aller au profile
      setCurrentStep(12);
    }
  };

  // Répondre à une question single choice
  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    saveToLocalStorage();
  };

  // Continuer après sélection single choice
  const handleContinueSingleChoice = () => {
    const question = getCurrentQuestion();
    if (!question) return;
    
    const savedAnswer = answers[question.id];
    if (savedAnswer) {
      if (currentStep < 11) {
        goNextQuestion();
      } else {
        // Fin des questions, aller au profile
        setCurrentStep(12);
      }
    }
  };

  // Validation du formulaire profile
  const validateProfile = () => {
    const errors: { name?: string; age?: string } = {};
    const trimmedName = profileName.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères";
    }
    
    const ageNum = parseInt(profileAge);
    if (!profileAge || isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      errors.age = "L'âge doit être entre 10 et 100 ans";
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Terminer le quiz
  const handleFinishQuiz = () => {
    if (!validateProfile()) return;

    const newAnswers = {
      ...answers,
      name: profileName.trim(),
      age: parseInt(profileAge),
    };
    setAnswers(newAnswers);
    
    const allData = {
      ...newAnswers,
      gender: answers.gender,
    };
    localStorage.setItem("stopharam_quiz", JSON.stringify(allData));
    localStorage.setItem("stopharam_profile", JSON.stringify({
      firstName: profileName.trim(),
      age: parseInt(profileAge),
    }));

    // Rediriger vers /analysis
    router.push("/analysis");
  };

  // Navigation
  const goPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goNextQuestion = () => {
    if (currentStep < 12) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      // Si on est sur gender, retourner à l'accueil
      router.push("/");
    } else {
      goPreviousQuestion();
    }
  };

  const handleSkip = () => {
    router.push("/profile");
  };

  // Obtenir le numéro de question pour l'affichage
  const getQuestionNumber = () => {
    if (currentStep === 0) return 1; // gender
    if (currentStep === 1) return null; // domaines (pas de numéro)
    if (currentStep >= 2 && currentStep <= 11) {
      return currentStep; // Questions 2 à 11
    }
    return null; // profile
  };

  // Obtenir la question actuelle
  const getCurrentQuestion = () => {
    if (currentStep === 0) return GENDER_QUESTION;
    if (currentStep >= 2 && currentStep <= 11) {
      return QUESTIONS[currentStep - 2];
    }
    return null;
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col px-6 pt-10 pb-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #0a1f12 0%, #0d2818 30%, #0f2d22 60%, #0d2435 85%, #0a1c2e 100%)",
      }}
    >
      {/* Légères étoiles en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <span className="absolute top-[12%] left-[10%] w-1 h-1 rounded-full bg-white/40" />
        <span className="absolute top-[18%] left-[78%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[25%] left-[22%] w-1.5 h-1.5 rounded-full bg-white/35" />
        <span className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-white/25" />
        <span className="absolute top-[22%] left-[88%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[35%] left-[65%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-[45%] left-[15%] w-1 h-1 rounded-full bg-white/25" />
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        {/* Header avec retour et progress bar */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
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
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <section className="flex-1">
          {currentStep === 0 ? (
            // Étape 0 : Question gender
            <div>
              <h2 className="text-white text-xl font-semibold text-center mb-2">
                Question #1
              </h2>
              <p className="text-white text-lg sm:text-xl font-normal text-left mb-6">
                {GENDER_QUESTION.text}
              </p>
              <div className="space-y-3 mb-6">
                {GENDER_QUESTION.options.map((option) => {
                  const isSelected = answers.gender === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleGenderAnswer(option)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-white/15 border-teal-400/70"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-white text-base">{option}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleContinueGender}
                disabled={!answers.gender}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors ${
                  answers.gender
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Continuer
              </button>
            </div>
          ) : currentStep === 1 ? (
            // Étape 1 : Sélection des domaines
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold text-left mb-2">
                Sur quoi veux-tu travailler en priorité ?
              </h1>
              <p className="text-white/80 text-sm mb-8 text-left">
                Tu peux en choisir un ou plusieurs.
              </p>

              <div className="space-y-3 mb-8">
                {DOMAINS.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedDomains.includes(domain)
                        ? "bg-white/10 border-teal-400/50"
                        : "bg-white/5 border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDomains.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="w-5 h-5 rounded border-white/30 bg-transparent text-teal-400 focus:ring-2 focus:ring-teal-400/50"
                    />
                    <span className="text-white text-base flex-1">
                      {domain}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleContinueFromDomains}
                disabled={selectedDomains.length === 0}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors ${
                  selectedDomains.length > 0
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Continuer
              </button>
            </div>
          ) : currentStep >= 2 && currentStep <= 11 ? (
            // Questions 2-11 (q1 à q10)
            (() => {
              const question = getCurrentQuestion();
              if (!question) return null;
              const questionNumber = getQuestionNumber();
              
              return (
                <div>
                  <h2 className="text-white text-xl font-semibold text-center mb-2">
                    Question #{questionNumber}
                  </h2>
                  <p className="text-white text-lg sm:text-xl font-normal text-left mb-6">
                    {question.text}
                  </p>

                  {question.multiSelect ? (
                    // Question multi-choix
                    <>
                      <div className="space-y-3 mb-6">
                        {question.options.map((option) => {
                          const isSelected = tempMultiSelect.includes(option);
                          return (
                            <label
                              key={option}
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-white/10 border-teal-400/50"
                                  : "bg-white/5 border-white/20 hover:bg-white/8"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleMultiSelectToggle(option)}
                                className="w-5 h-5 rounded border-white/30 bg-transparent text-teal-400 focus:ring-2 focus:ring-teal-400/50"
                              />
                              <span className="text-white text-base flex-1">
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleContinueMultiSelect}
                        disabled={tempMultiSelect.length === 0}
                        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors ${
                          tempMultiSelect.length > 0
                            ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                            : "bg-white/20 text-white/50 cursor-not-allowed"
                        }`}
                      >
                        Continuer
                      </button>
                    </>
                  ) : (
                    // Question single choice
                    <>
                      <div className="space-y-3 mb-6">
                        {question.options.map((option) => {
                          const savedAnswer = answers[question.id];
                          const isSelected =
                            typeof savedAnswer === "string" && savedAnswer === option;
                          return (
                            <button
                              key={option}
                              onClick={() => handleAnswer(question.id, option)}
                              className={`w-full text-left p-4 rounded-xl border transition-all ${
                                isSelected
                                  ? "bg-white/15 border-teal-400/70"
                                  : "bg-white/5 border-white/20 hover:bg-white/10"
                              }`}
                            >
                              <span className="text-white text-base">{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleContinueSingleChoice}
                        disabled={!answers[question.id]}
                        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors ${
                          answers[question.id]
                            ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                            : "bg-white/20 text-white/50 cursor-not-allowed"
                        }`}
                      >
                        Continuer
                      </button>
                    </>
                  )}
                </div>
              );
            })()
          ) : currentStep === 12 ? (
            // Étape 12 : Profile (Nom + Âge)
            <div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold text-left mb-2">
                Un peu plus sur toi
              </h1>
              
              <div className="space-y-6 mt-8">
                {/* Champ Nom */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      if (profileErrors.name) {
                        setProfileErrors({ ...profileErrors, name: undefined });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-colors"
                    placeholder="Ton prénom"
                  />
                  {profileErrors.name && (
                    <p className="mt-2 text-amber-300 text-sm">{profileErrors.name}</p>
                  )}
                </div>

                {/* Champ Âge */}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Âge
                  </label>
                  <input
                    type="number"
                    value={profileAge}
                    onChange={(e) => {
                      setProfileAge(e.target.value);
                      if (profileErrors.age) {
                        setProfileErrors({ ...profileErrors, age: undefined });
                      }
                    }}
                    min="10"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-colors"
                    placeholder="Ton âge"
                  />
                  {profileErrors.age && (
                    <p className="mt-2 text-amber-300 text-sm">{profileErrors.age}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleFinishQuiz}
                disabled={!profileName.trim() || profileName.trim().length < 2 || !profileAge || isNaN(parseInt(profileAge)) || parseInt(profileAge) < 10 || parseInt(profileAge) > 100}
                className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors mt-8 ${
                  profileName.trim().length >= 2 && profileAge && !isNaN(parseInt(profileAge)) && parseInt(profileAge) >= 10 && parseInt(profileAge) <= 100
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                Terminer le quizz
              </button>
            </div>
          ) : null}
        </section>

        {/* Bouton Skip test en bas (uniquement si pas sur profile) */}
        {currentStep !== 12 && (
          <footer className="mt-8 text-center">
            <button
              onClick={handleSkip}
              className="text-white/60 text-sm font-normal hover:text-white/90 focus:outline-none focus:underline transition-colors"
            >
              Passer le test
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
