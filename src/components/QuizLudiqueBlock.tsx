"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/storage";
import type { SelectedSin } from "@/lib/storage";
import { getSinLabel } from "@/lib/storage";
import { pickQuizQuestions, type QuizQuestion } from "@/lib/quizLudiqueData";
import { addQuizGratitude } from "@/lib/quizLudique";
import { getTotalPoints } from "@/lib/pointsGratitude";

type Phase = "intro" | "quiz" | "result";

const POINTS_PER_CORRECT = 10;

export default function QuizLudiqueBlock() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions] = useState<QuizQuestion[]>(() => {
    const user = getUser();
    const sins: SelectedSin[] = user?.selectedSins?.length ? user.selectedSins : (["autre"] as SelectedSin[]);
    return pickQuizQuestions(sins);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleStart = () => {
    setPhase("quiz");
    setCurrentIndex(0);
    setSelectedChoice(null);
    setScore(0);
    setShowExplanation(false);
  };

  const handleChoice = (choiceIndex: number) => {
    if (selectedChoice != null) return;
    setSelectedChoice(choiceIndex);
    const correct = choiceIndex === currentQuestion.correctIndex;
    if (correct) setScore((s) => s + POINTS_PER_CORRECT);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
      setShowExplanation(false);
    } else {
      addQuizGratitude(score);
      setPhase("result");
    }
  };

  const handleBackToHome = () => {
    setPhase("intro");
    setCurrentIndex(0);
    setSelectedChoice(null);
    setScore(0);
    setShowExplanation(false);
  };

  if (phase === "intro") {
    const total = getTotalPoints();
    return (
      <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 px-5 py-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/25 text-amber-200 text-xl" aria-hidden>
            📖
          </span>
          <div>
            <h2 className="text-amber-200 font-semibold text-lg">Quiz du jour</h2>
            <p className="text-white/70 text-sm">10 questions sur tes objectifs, basées sur l&apos;Islam et la psychologie.</p>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-4">
          Gagne des <strong className="text-amber-200">points de gratitude</strong> à chaque bonne réponse. Tu en gagnes aussi en validant tes jours de défi. À partir de 100 pts, tu peux offrir 1 mois gratuit à un proche.
        </p>
        {total > 0 && (
          <p className="text-amber-200/90 text-xs mb-4">
            Tu as <strong>{total}</strong> points au total.
          </p>
        )}
        <button
          type="button"
          onClick={handleStart}
          className="w-full rounded-xl bg-amber-500/30 border border-amber-400/50 py-3.5 text-amber-100 font-semibold text-base hover:bg-amber-500/40 transition-colors"
        >
          Commencer le quiz
        </button>
        <button
          type="button"
          onClick={() => router.push("/parcours")}
          className="w-full mt-3 rounded-xl bg-white/10 border border-white/20 py-2.5 text-white/80 font-medium text-sm hover:bg-white/15 transition-colors"
        >
          Ou continuer mon parcours
        </button>
      </div>
    );
  }

  if (phase === "quiz" && currentQuestion) {
    const correctIndex = currentQuestion.correctIndex;
    const chosenCorrect = selectedChoice === correctIndex;

    return (
      <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-amber-200/90 text-sm font-medium">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-white/70 text-sm">{score} pts</span>
        </div>
        <p className="text-white font-medium mb-4 leading-relaxed">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.choices.map((choice, i) => {
            let style = "bg-white/10 border-white/20 text-white hover:bg-white/15";
            if (selectedChoice != null) {
              if (i === correctIndex) style = "bg-emerald-500/25 border-emerald-400/50 text-emerald-100";
              else if (i === selectedChoice && i !== correctIndex) style = "bg-red-500/20 border-red-400/40 text-red-100";
              else style = "bg-white/5 border-white/10 text-white/60";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleChoice(i)}
                disabled={selectedChoice != null}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:pointer-events-none ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {showExplanation && currentQuestion.explanation && (
          <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15">
            <p className="text-white/90 text-xs leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}
        {showExplanation && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full mt-4 rounded-xl bg-amber-500/30 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/40 transition-colors"
          >
            {isLastQuestion ? "Voir mon score" : "Question suivante"}
          </button>
        )}
      </div>
    );
  }

  if (phase === "result") {
    const total = getTotalPoints();
    const pct = questions.length > 0 ? Math.round((score / (questions.length * POINTS_PER_CORRECT)) * 100) : 0;
    const isGreat = pct >= 70;

    return (
      <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 px-5 py-5">
        <div className="text-center mb-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/30 text-2xl" aria-hidden>
            {isGreat ? "🌟" : "💪"}
          </span>
          <h2 className="text-amber-200 font-semibold text-lg mt-2">Quiz terminé</h2>
          <p className="text-white/90 text-2xl font-bold mt-1">{score} / {questions.length * POINTS_PER_CORRECT} points</p>
          <p className="text-white/70 text-sm mt-1">{pct}% de bonnes réponses</p>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 mb-4">
          <p className="text-white/90 text-sm leading-relaxed">
            {isGreat
              ? "Barakallahou fik ! Tu renforces ta connaissance et ta motivation. Continue comme ça, khayr in cha Allah."
              : "Chaque question est une occasion d'apprendre. Tu peux refaire le quiz quand tu veux pour gagner encore des points de gratitude."}
          </p>
        </div>
        <p className="text-amber-200/90 text-xs mb-4">
          Total de gratitude : <strong>{total}</strong> points
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex-1 rounded-xl bg-white/10 border border-white/20 py-3 text-white/90 font-medium text-sm hover:bg-white/15 transition-colors"
          >
            Refaire un quiz
          </button>
          <button
            type="button"
            onClick={() => router.push("/parcours")}
            className="flex-1 rounded-xl bg-amber-500/30 border border-amber-400/50 py-3 text-amber-100 font-semibold text-sm hover:bg-amber-500/40 transition-colors"
          >
            Continuer mon parcours
          </button>
        </div>
      </div>
    );
  }

  return null;
}
