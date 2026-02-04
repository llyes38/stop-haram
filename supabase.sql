-- StopHaram - Supabase schema & RLS
-- Exécuter dans Supabase SQL Editor

-- 1) Table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  display_name text
);

-- 2) Table quiz_results
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  analysis jsonb NOT NULL DEFAULT '{}'::jsonb,
  sin_categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  share_code text UNIQUE,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS quiz_results_user_id_idx ON quiz_results(user_id);

-- 3) RLS - profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4) RLS - quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_results_select_own" ON quiz_results;
CREATE POLICY "quiz_results_select_own" ON quiz_results FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "quiz_results_insert_own" ON quiz_results;
CREATE POLICY "quiz_results_insert_own" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "quiz_results_update_own" ON quiz_results;
CREATE POLICY "quiz_results_update_own" ON quiz_results FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "quiz_results_delete_own" ON quiz_results;
CREATE POLICY "quiz_results_delete_own" ON quiz_results FOR DELETE USING (auth.uid() = user_id);

-- 5) Table user_progress (sauvegarde unifiée par utilisateur)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own progress" ON public.user_progress;
CREATE POLICY "read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert own progress" ON public.user_progress;
CREATE POLICY "insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update own progress" ON public.user_progress;
CREATE POLICY "update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete own progress" ON public.user_progress;
CREATE POLICY "delete own progress" ON public.user_progress FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS user_progress_updated_at_idx ON public.user_progress(updated_at);
