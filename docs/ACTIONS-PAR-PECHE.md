# Liste des actions par type de péché — StopHaram

Ce document indique où se trouvent toutes les actions utilisées dans l’app pour chaque type de péché, afin que tu puisses les étudier ou les réutiliser.

---

## 1. Source dans le code

- **Fichier principal** : `src/lib/programEngine.ts`
  - **ACTION_1** : première action de chaque jour (une est choisie parmi la liste), par péché.
  - **FOCUS_ACTIONS** : actions « focus » du jour (intention, objectif), par péché.
  - **CUSTOM_SIN_ACTIONS** : actions pour les péchés personnalisés (« autre »), mappées par mot-clé (gaspillage, médisance, paresse, vandalisme, hypocrisie, voyeurisme, éducation).
- **Labels des péchés** : `src/lib/storage.ts` → `getSinLabel(sin)` (porno → « Relations illicites », musique → « Musique », etc.).

---

## 2. Types de péché (SelectedSin)

| Clé       | Label affiché        |
|----------|------------------------|
| porno    | Relations illicites   |
| musique  | Musique                |
| priere   | Prière                 |
| colere   | Colère                 |
| drogue   | Drogue                 |
| alcool   | Alcool                 |
| jeux     | Jeux                   |
| mensonge | Mensonge               |
| regard   | Regard                 |
| autre    | Autre (ou personnalisé)|

---

## 3. Récupérer la liste en JSON

Tu peux récupérer **toutes les actions** (ACTION_1 + FOCUS_ACTIONS + CUSTOM_SIN_ACTIONS) en JSON :

- **En local** : ouvre `http://localhost:3000/api/export/actions` dans le navigateur (avec l’app lancée en dev).
- **En prod** : ouvre `https://stop-haram.vercel.app/api/export/actions` (ou ton URL de déploiement).

Enregistre la page en fichier (Ctrl+S / Cmd+S) pour obtenir `stop-haram-actions-par-peche.json` (ou un nom au choix).

Structure du JSON :

- **bySin** : pour chaque clé de péché (porno, musique, …), un objet avec `label`, `action1` (liste d’actions « première action »), `focus` (liste d’actions « focus »).
- **customSinActions** : pour chaque mot-clé de péché personnalisé, `action1` et `focus` (listes d’actions).

Chaque action a la forme : `{ "title": "...", "desc": "..." }`.

---

## 4. Résumé

| Besoin                         | Où aller |
|--------------------------------|----------|
| Voir / modifier les actions     | `src/lib/programEngine.ts` (ACTION_1, FOCUS_ACTIONS, CUSTOM_SIN_ACTIONS) |
| Étudier la liste en JSON        | GET `/api/export/actions` puis sauvegarder le JSON |
| Labels des péchés               | `src/lib/storage.ts` → `getSinLabel` |

Tu peux t’en servir pour relire, comparer ou faire évoluer les actions par type de péché.
