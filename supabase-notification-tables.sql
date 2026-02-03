-- StopHaram - Tables notifications planifiées (QStash)
-- Exécuter dans Supabase SQL Editor

-- 1) Préférences de notification par utilisateur
CREATE TABLE IF NOT EXISTS public.notification_prefs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone text NOT NULL DEFAULT 'Europe/Paris',
  daily_checkin_enabled boolean NOT NULL DEFAULT true,
  daily_checkin_time text NOT NULL DEFAULT '20:30',
  actions_morning boolean NOT NULL DEFAULT true,
  actions_morning_time text NOT NULL DEFAULT '08:30',
  actions_evening boolean NOT NULL DEFAULT true,
  actions_evening_time text NOT NULL DEFAULT '21:30',
  sin_reminder_enabled boolean NOT NULL DEFAULT false,
  sin_reminder_time text NOT NULL DEFAULT '23:00',
  quiet_start text NOT NULL DEFAULT '23:30',
  quiet_end text NOT NULL DEFAULT '08:00',
  city text,
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notification_prefs_select_own" ON public.notification_prefs;
CREATE POLICY "notification_prefs_select_own" ON public.notification_prefs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_prefs_insert_own" ON public.notification_prefs;
CREATE POLICY "notification_prefs_insert_own" ON public.notification_prefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_prefs_update_own" ON public.notification_prefs;
CREATE POLICY "notification_prefs_update_own" ON public.notification_prefs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2) File d'attente des notifications
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, type, scheduled_at)
);

CREATE INDEX IF NOT EXISTS notification_queue_scheduled_status_idx
  ON public.notification_queue (scheduled_at, status);

CREATE INDEX IF NOT EXISTS notification_queue_user_id_idx ON public.notification_queue(user_id);

ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Les cron (service_role) lisent/écrivent sans RLS. L'utilisateur n'a pas besoin d'accéder à la queue.
DROP POLICY IF EXISTS "notification_queue_select_own" ON public.notification_queue;
CREATE POLICY "notification_queue_select_own" ON public.notification_queue
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_queue_insert_own" ON public.notification_queue;
CREATE POLICY "notification_queue_insert_own" ON public.notification_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_queue_update_own" ON public.notification_queue;
CREATE POLICY "notification_queue_update_own" ON public.notification_queue
  FOR UPDATE USING (auth.uid() = user_id);
