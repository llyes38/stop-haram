# Debug — chargement infini (Android / Chrome)

## Ce qui a été ajouté

### 1. Page `/debug` (publique)
- **Build** : `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` ou `NEXT_PUBLIC_BUILD_ID`
- **userAgent**, **online/offline**, **temps depuis navigationStart**
- **Fetch /api/health** : vérifie que le serveur répond (bouton Rafraîchir)
- **Supabase ping** : `getSession()` (bouton Tester Supabase)
- **Erreurs** : `window.onerror` + `unhandledrejection`
- **Boutons** : Clear localStorage/sessionStorage, Hard reload

Accès : `https://ton-domaine.com/debug` (route publique, pas de redirection).

### 2. Route `/api/health`
- `GET /api/health` → `{ ok: true, ts: Date.now() }`
- Aucune dépendance externe (pas de Supabase, pas de DB).
- Permet de savoir si le blocage vient du serveur ou du client.

## Audit du boot (ordre d’exécution)

1. **Root layout** (`app/layout.tsx`)  
   Charge `globals.css`, `Providers`, `AppGuard`, puis `children`.

2. **Providers** (`app/providers.tsx`)  
   - `AuthProvider` : au montage appelle `supabase.auth.getSession()` (réseau).  
     Tant que la réponse n’est pas là, `loading === true`.  
     Ensuite, si session : `hydrateFromProgress(userId)` → `loadProgress(userId)` (Supabase).
   - `GuestSyncModal` : rendu à chaque fois.

3. **AppGuard** (`components/AppGuard.tsx`)  
   - Attend que `authLoading === false` avant de décider (redirection ou `setReady(true)`).  
   - Si `authLoading` reste `true` longtemps (ex. `getSession()` lent ou bloqué), l’utilisateur reste sur « Chargement… ».

4. **Causes possibles de chargement infini**
   - **`getSession()` très lent ou bloqué** (réseau, cookies, CORS, Supabase).
   - **`loadProgress()` / `hydrateFromProgress`** qui bloque ou échoue sans terminer.
   - **Boucle de redirection** dans AppGuard (pathname public vs non public, `isLoggedIn` / `onboardingComplete`).

## Pistes de correction

1. **Ne pas bloquer l’affichage sur `getSession()`**  
   Afficher tout de suite le shell (ex. « Chargement… » ou la page), et mettre à jour l’état auth quand `getSession()` répond (sans empêcher le premier paint).

2. **Timeouts**  
   Si `getSession()` ou `loadProgress()` dépasse X secondes, considérer l’utilisateur déconnecté / sans données et passer à l’écran public (ex. `/start` ou contenu invité).

3. **Page /debug sans AuthProvider**  
   Pour que `/debug` reste utilisable même si Auth/ Supabase plante, on peut mettre `/debug` dans un route group avec un layout minimal (sans `Providers` / sans `AppGuard`). À faire si besoin.

4. **Service Worker / PWA**  
   Vérifier qu’aucun SW ne sert une vieille version qui bloque (cache agressif). Sur `/debug`, bouton « Hard reload » pour recharger sans cache.

## Utilisation

1. En prod, ouvrir `https://ton-domaine.com/debug` (sur Android Chrome si le bug apparaît là).
2. Regarder : temps depuis navigationStart, résultat de /api/health, erreurs capturées.
3. Cliquer sur « Tester Supabase » : si ça reste en attente ou en erreur, le blocage vient probablement de Supabase / réseau.
4. Si besoin : « Clear localStorage/sessionStorage » puis « Hard reload », puis refaire un parcours et retourner sur `/debug` pour comparer.
