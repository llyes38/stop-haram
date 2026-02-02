# Connexion Google — configuration à zéro (étape par étape)

Tu as tout supprimé dans Supabase et Google Cloud. On reprend dans l’ordre.

---

## Prérequis

- Un projet **Supabase** (URL du type `https://XXXX.supabase.co`).
- L’URL de ton app en production (ex. `https://stop-haram.vercel.app`).

On va faire **d’abord Google Cloud**, puis **Supabase**, puis vérifier l’app.

---

## Étape 1 — Google Cloud : créer le projet (si besoin)

1. Va sur **[Google Cloud Console](https://console.cloud.google.com/)**.
2. En haut à gauche : sélectionne ou crée un **projet** (ex. « StopHaram »).
3. Une fois le projet sélectionné, passe à l’étape 2.

---

## Étape 2 — Google Cloud : écran de consentement OAuth

1. Menu **☰** → **APIs & Services** → **OAuth consent screen** (ou [lien direct](https://console.cloud.google.com/apis/credentials/consent)).
2. Type d’application : **External** (ou Internal si c’est uniquement pour ton organisation).
3. Remplis au minimum :
   - **App name** : StopHaram (ou le nom de ton app).
   - **User support email** : ton email.
   - **Developer contact** : ton email.
4. Clique **Save and Continue**.
5. **Scopes** : **Save and Continue** (les scopes par défaut suffisent pour « Se connecter avec Google »).
6. **Test users** (si en mode Test) : tu peux ajouter ton email. **Save and Continue**.
7. Retour au tableau de bord : l’écran de consentement est prêt.

---

## Étape 3 — Google Cloud : créer le client OAuth (Web)

1. Menu **☰** → **APIs & Services** → **Credentials** (ou [lien direct](https://console.cloud.google.com/apis/credentials)).
2. Clique **+ Create Credentials** → **OAuth client ID**.
3. **Application type** : **Web application**.
4. **Name** : ex. « StopHaram Web ».
5. **Authorized JavaScript origins** — ajoute **exactement** :
   - `https://stop-haram.vercel.app`
   - Si tu testes en local : `http://localhost:3000`
6. **Authorized redirect URIs** — c’est ici que l’erreur `redirect_uri_mismatch` vient si c’est faux.
   - Tu dois ajouter l’URL de **Supabase**, pas celle de ton site.
   - Format : `https://[TON_PROJECT_REF].supabase.co/auth/v1/callback`
   - Pour trouver `[TON_PROJECT_REF]` :
     - Ouvre ton **Supabase Dashboard** → ton projet.
     - Regarde l’URL dans le navigateur : `https://supabase.com/dashboard/project/XXXX` → **XXXX** est le project ref.
     - Ou dans **Settings** → **API** : l’URL du projet est affichée (ex. `https://uzasqjtyekzkzgoubgsi.supabase.co` → le ref est `uzasqjtyekzkzgoubgsi`).
   - Exemple : si ton ref est `uzasqjtyekzkzgoubgsi`, ajoute :
     - `https://uzasqjtyekzkzgoubgsi.supabase.co/auth/v1/callback`
   - Pas d’espace, pas de slash à la fin.
7. Clique **Create**.
8. Une popup affiche **Client ID** et **Client Secret**. **Copie-les et garde-les** (tu en auras besoin à l’étape 5). Tu peux aussi les retrouver plus tard dans Credentials → ton client OAuth.

---

## Étape 4 — Supabase : récupérer l’URL du projet (si tu ne l’as pas)

1. **[Supabase Dashboard](https://supabase.com/dashboard)** → ton projet.
2. **Settings** (icône engrenage) → **API**.
3. Note :
   - **Project URL** : `https://XXXX.supabase.co` → c’est ta `NEXT_PUBLIC_SUPABASE_URL`.
   - **anon public** key → c’est ta `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Tu en auras besoin pour `.env.local` et Vercel. L’URL du projet sert aussi à construire l’URI de redirection Google (étape 3).

---

## Étape 5 — Supabase : activer le provider Google

1. Dans le même projet Supabase : **Authentication** (menu gauche) → **Providers**.
2. Trouve **Google** → clique pour ouvrir la config.
3. **Enable Google** : active le switch.
4. Colle le **Client ID** (copié à l’étape 3).
5. Colle le **Client Secret** (copié à l’étape 3).
6. **Save**.

Ne pas confondre avec d’autres providers (Apple, etc.) : on ne remplit que Google pour l’instant.

---

## Étape 6 — Supabase : URLs du site et redirections

1. Toujours dans Supabase : **Authentication** → **URL Configuration**.
2. **Site URL** : mets l’URL de ton app en production, ex. :
   - `https://stop-haram.vercel.app`
   - Pas de slash à la fin.
3. **Redirect URLs** : liste des URLs autorisées après connexion. Ajoute (une par ligne) :
   - `https://stop-haram.vercel.app/api/auth/callback`
   - Si tu testes en local : `http://localhost:3000/api/auth/callback`
4. **Save**.

---

## Étape 7 — Variables d’environnement (local et Vercel)

### En local (`.env.local`)

À la racine du projet, fichier `.env.local` avec au minimum :

```env
NEXT_PUBLIC_SUPABASE_URL=https://[TON_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...ta_cle_anon...
NEXT_PUBLIC_APP_URL=https://stop-haram.vercel.app
```

Remplace `[TON_PROJECT_REF]` et `eyJ...` par les valeurs de l’étape 4. Pour le dev en local, tu peux mettre `NEXT_PUBLIC_APP_URL=http://localhost:3000` si tu veux que les redirections reviennent sur localhost.

### Sur Vercel

1. **Vercel** → ton projet → **Settings** → **Environment Variables**.
2. Ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://[TON_PROJECT_REF].supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ta clé anon
   - `NEXT_PUBLIC_APP_URL` = `https://stop-haram.vercel.app`
3. **Redeploy** le projet (pour que les variables soient prises en compte).

---

## Étape 8 — Vérification

1. **Google** : Credentials → ton client OAuth → **Authorized redirect URIs** doit contenir exactement :  
   `https://[TON_PROJECT_REF].supabase.co/auth/v1/callback`
2. **Supabase** : Providers → Google activé, Client ID + Secret renseignés ; URL Configuration → Site URL + Redirect URLs comme ci-dessus.
3. **App** : `.env.local` (local) et Vercel (prod) avec les 3 variables.

Ensuite :

- En local : redémarre le serveur (`npm run dev`), ouvre `http://localhost:3000/login`, clique sur « Continuer avec Google ».
- En prod : ouvre `https://stop-haram.vercel.app/login`, même test.

Si tu as encore **redirect_uri_mismatch** : ouvre `https://stop-haram.vercel.app/auth/google-setup` (ou `/auth/google-setup` en local) : la page affiche l’URI exacte que l’app utilise. Compare avec ce qui est dans Google Cloud (Authorized redirect URIs) — ça doit être identique caractère pour caractère.

---

## Résumé des URLs à ne pas mélanger

| Où ça va | URL |
|----------|-----|
| **Google Cloud** → Authorized redirect URIs | `https://[REF].supabase.co/auth/v1/callback` (Supabase) |
| **Supabase** → Redirect URLs | `https://stop-haram.vercel.app/api/auth/callback` (ton app) |
| **Supabase** → Site URL | `https://stop-haram.vercel.app` |

Google redirige vers **Supabase**. Supabase redirige ensuite vers **ton app** (`/api/auth/callback`).
