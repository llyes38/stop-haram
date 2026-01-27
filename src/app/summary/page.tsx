"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SummaryPage() {
  const router = useRouter();
  const [domains, setDomains] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<Record<string, string | string[]>>({});
  const [profile, setProfile] = useState<{ firstName: string; age: number } | null>(null);

  useEffect(() => {
    const savedDomains = localStorage.getItem("stopharam_domains");
    const savedQuiz = localStorage.getItem("stopharam_quiz");
    const savedProfile = localStorage.getItem("stopharam_profile");

    if (savedDomains) {
      setDomains(JSON.parse(savedDomains));
    }
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz));
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

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
      </div>

      <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 relative z-10">
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-left mb-8">
          Résumé
        </h1>

        <div className="space-y-6 mb-8">
          {/* Profil */}
          {profile && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <h2 className="text-white font-semibold text-lg mb-3">Profil</h2>
              <div className="space-y-2 text-white/90">
                <p>
                  <span className="font-medium">Prénom :</span> {profile.firstName}
                </p>
                <p>
                  <span className="font-medium">Âge :</span> {profile.age} ans
                </p>
              </div>
            </div>
          )}

          {/* Domaines */}
          {domains.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <h2 className="text-white font-semibold text-lg mb-3">
                Domaines sélectionnés
              </h2>
              <ul className="space-y-2">
                {domains.map((domain, index) => (
                  <li key={index} className="text-white/90 text-sm">
                    • {domain}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Réponses du quiz */}
          {Object.keys(quiz).length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <h2 className="text-white font-semibold text-lg mb-3">
                Réponses du quiz
              </h2>
              <div className="space-y-4">
                {Object.entries(quiz).map(([questionId, answer]) => {
                  const questionNumber = questionId.replace("q", "");
                  const isArray = Array.isArray(answer);
                  return (
                    <div key={questionId} className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
                      <p className="text-white/70 text-xs mb-1">
                        Question {questionNumber}
                      </p>
                      {isArray ? (
                        <ul className="space-y-1">
                          {answer.map((item, index) => (
                            <li key={index} className="text-white/90 text-sm">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white/90 text-sm">{answer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message si aucune donnée */}
          {!profile && domains.length === 0 && Object.keys(quiz).length === 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-sm">
                Aucune donnée enregistrée pour le moment.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="w-full py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-base shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors text-center block"
        >
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
