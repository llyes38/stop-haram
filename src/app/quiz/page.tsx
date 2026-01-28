import { Suspense } from "react";
import QuizClient from "./QuizClient";

// Empêche Next.js d'essayer de pré-rendre /quiz à la compilation
// (utile car la page dépend fortement du client et de localStorage).
export const dynamic = "force-dynamic";

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Chargement…</div>}>
      <QuizClient />
    </Suspense>
  );
}

