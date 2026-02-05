# Migration : Google OAuth → Magic Link (email)

## Fait dans le code

- **Google OAuth supprimé** : plus de `signInWithOAuth({ provider: "google" })`, plus de callback OAuth, plus de pages `/auth/google-setup` ni `/api/auth/google-redirect-uri`.
- **Connexion** : page `/login` avec champ email + bouton « Recevoir le lien magique » (Supabase `signInWithOtp`). Email pré-rempli depuis `localStorage.stopharam_email` si présent.
- **Callback Magic Link** : page `/auth/callback` — Supabase redirige ici après clic sur le lien dans l’email ; la session est établie côté client, puis redirection vers `/home`.
- **Inscription après paiement** : page `/success` — après paiement Stripe (ou en dev sans Stripe), l’utilisateur saisit son email et reçoit un Magic Link. `stopharam_email` et `stopharam_pendingStripeSessionId` sont enregistrés en localStorage.
- **Checkout** : appel à `/api/checkout` (POST avec `forfait`) qui crée une session Stripe (si configurée) ou redirige vers `/success?session_id=dev`. Vérification du paiement via `/api/verify-session?session_id=xxx`.

## Config Supabase (Auth)

1. **Dashboard Supabase** → Authentication → Providers → **Email** : activer « Enable Email provider » et option « Confirm email » si tu veux confirmer l’email.
2. **Authentication** → **URL Configuration** → **Redirect URLs** : ajouter l’URL de callback Magic Link, par ex.  
   `https://ton-domaine.com/auth/callback`  
   (et en local : `http://localhost:3000/auth/callback`).

## Config Stripe (optionnel)

- Variables d’environnement : `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`.
- Package : `npm i stripe` si tu utilises Stripe en prod.
- Sans Stripe : le checkout redirige vers `/success?session_id=dev` et la page success considère le paiement comme validé (pour dev).

## Table `profiles` (Supabase)

Voir `supabase-profiles-magic-link.sql` pour ajouter `email`, `onboarding_json`, `quiz_json`, `entitlement` à la table `profiles`. À exécuter dans le SQL Editor Supabase si besoin.

## Parcours utilisateur

1. Landing / quiz / onboarding (localStorage).
2. Paiement (checkout → Stripe ou `/success?session_id=dev`).
3. Page success : saisie email → envoi Magic Link → message « Va cliquer dans ton mail ».
4. Clic sur le lien → `/auth/callback` → session créée → redirection `/home`.
5. Reconnexion : aller sur `/login`, email pré-rempli si déjà utilisé → « Recevoir le lien magique ».
