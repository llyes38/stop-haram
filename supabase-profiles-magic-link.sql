-- Migration : table profiles pour Magic Link (email, onboarding_json, quiz_json, entitlement)
-- Exécuter dans Supabase SQL Editor après le schéma de base.

-- Ajouter les colonnes si la table profiles existe déjà
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_json jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_json jsonb DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS entitlement jsonb DEFAULT '{}'::jsonb;

-- Si la table n'existe pas, la créer avec toutes les colonnes
-- (à exécuter seulement si profiles n'existe pas)
-- CREATE TABLE IF NOT EXISTS profiles (
--   id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   email text,
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now(),
--   display_name text,
--   onboarding_json jsonb DEFAULT '{}'::jsonb,
--   quiz_json jsonb DEFAULT '{}'::jsonb,
--   entitlement jsonb DEFAULT '{}'::jsonb
-- );

-- RLS déjà sur profiles (select/insert/update own)
