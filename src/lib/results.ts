import { supabase } from "./supabase/client";

export type QuizResultData = {
  answers: Record<string, string | string[]>;
  analysis?: Record<string, unknown>;
  sin_categories?: string[];
};

export async function saveQuizResult(data: QuizResultData): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non connecté" };

  const { error } = await supabase
    .from("quiz_results")
    .upsert(
      {
        user_id: user.id,
        answers: data.answers,
        analysis: data.analysis ?? {},
        sin_categories: data.sin_categories ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
