import { supabase } from "./supabase/client";
import { saveProgress } from "./progressStorage";
import type { QuizResultData } from "./progressStorage";

export type { QuizResultData } from "./progressStorage";

/**
 * Sauvegarde le résultat du quiz : Supabase (user_progress) si connecté, localStorage si invité.
 */
export async function saveQuizResult(data: QuizResultData): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  return saveProgress({ quiz_result: data }, userId);
}
