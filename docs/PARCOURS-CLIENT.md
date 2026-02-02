# Parcours client StopHaram

## Résumé du flux

1. **Nouveau client** reçoit le lien de l’app → il arrive sur les **premières pages (onboarding)**.
2. Il fait **tout le parcours** (quiz, paiement, etc.) puis arrive sur la page **« Se connecter / Sans compte »** (page de connexion).
3. Une fois **inscrit** (avec compte Google/email ou « Continuer sans compte »), **à chaque ouverture** de l’app il arrive **directement dans l’app** (accueil), **sans refaire** l’onboarding.

---

## Détail technique

### Première visite (nouveau)

- **URL** : lien reçu (ex. `https://.../` ou `https://.../start`).
- **Non connecté** → redirection vers **`/start`** (page Bienvenue : Google, email, Continuer sans compte).
- S’il choisit **« Continuer sans compte »** → `auth` + état « invité », puis redirection vers **`/profile`** (onboarding).
- Il enchaîne : **profile → quiz → analysis → … → checkout → signup** (ou équivalent).
- Sur **signup** il peut « Passer » ou se connecter → **`completeOnboarding()`** puis redirection vers **`/home`**.

### Visites suivantes (déjà inscrit)

- **URL** : même lien ou raccourci vers l’app.
- **Connecté** (localStorage `is_logged_in` + `onboardingComplete`) → **redirection directe vers `/home`**.
- Même s’il atterrit sur **`/start`**, il est **renvoyé vers `/home`** (pas de re-affichage de la page « Se connecter / sans compte »).

### Vérifications utilisées

- **`isLoggedIn()`** : auth locale (localStorage).
- **`isOnboardingComplete()`** : état `onboardingComplete` dans le state (localStorage).
- **`hasDecouverteSeen()`** : première fois dans l’app après inscription → page **Découverte** une fois, puis **Home**.

---

## Si « c’est mélangé » sur le téléphone

Causes possibles :

1. **Cache / stockage** : suppression des données du site ou du navigateur → localStorage effacé → l’app te considère comme **nouveau** → retour à `/start` ou onboarding.
2. **Navigation / favoris** : ouverture d’un **lien vers `/start`** au lieu du lien principal (ex. `/` ou `/home`) → avec la correction actuelle, si tu es déjà inscrit tu es quand même redirigé vers `/home`.
3. **Deux appareils** : inscription sur un appareil, ouverture sur un autre **sans connexion** → pas de compte reconnu sur le 2ᵉ appareil → flux « nouveau » sur celui-ci.

**À faire côté utilisateur** : utiliser toujours le **même lien** pour ouvrir l’app, ne pas vider les données du site, et se connecter avec le même compte (Google/email) si tu changes d’appareil.
