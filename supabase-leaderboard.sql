-- Table classement Communauté (sans Auth, identifié par device_key)
create table if not exists public.leaderboard_entries (
  device_key text primary key,
  display_name text not null,
  instagram_handle text,
  score integer not null default 0,
  streak_days integer not null default 0,
  challenge_id text not null default 'challenge_30d_v1',
  completed_at timestamptz,
  consent_public boolean not null default false,
  eligible_for_draw boolean not null default false,
  draw_month text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists leaderboard_score_idx
  on public.leaderboard_entries (score desc);

create index if not exists leaderboard_consent_idx
  on public.leaderboard_entries (consent_public) where consent_public = true;

comment on table public.leaderboard_entries is 'Classement Communauté — device_key = appareil, pas d''auth.';
