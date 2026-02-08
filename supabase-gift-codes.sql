-- Codes cadeau "offrir à un proche" (Stripe) : 1 utilisation par code sur le téléphone du bénéficiaire.
create table if not exists public.gift_codes (
  code text primary key,
  plan text not null check (plan in ('monthly', 'annual')),
  stripe_session_id text not null unique,
  created_at timestamptz default now(),
  used_at timestamptz
);

create index if not exists gift_codes_stripe_session_idx
  on public.gift_codes (stripe_session_id);
create index if not exists gift_codes_used_at_idx
  on public.gift_codes (used_at) where used_at is null;

comment on table public.gift_codes is 'Codes cadeau Stripe : lien partagé au proche pour activer l''offre sur son téléphone.';
