# Notifications StopHaram

## Ce qui fonctionne

### 1. Rappel « Actions du jour » + Verset du jour (9h Paris)

- **Quand** : tous les jours à 9h (heure de Paris, via cron Vercel à 8h UTC).
- **Comment** : notification **Web Push** envoyée par le serveur à tous les abonnés.
- **Fonctionne** même si l’app est fermée ou le navigateur fermé (tant que l’utilisateur a autorisé les notifications et que l’abonnement push est enregistré).

**Configuration requise :**

- Sur Vercel : variable d’environnement `CRON_SECRET` (Vercel l’utilise pour appeler le cron).
- Clés VAPID : `NEXT_PUBLIC_VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` (déjà utilisées pour les push).
- Le cron est défini dans `vercel.json` : `/api/cron/daily-reminder` à 8h UTC.

Le message inclut un rappel pour les actions du jour et le **verset du jour** (rotation parmi une liste de versets).

---

### 2. Rappel heure de prière (5 min avant)

- **Quand** : 5 minutes avant chaque prière (Fajr, Dhuhr, Asr, Maghrib, Isha), selon la ville configurée dans l’app.
- **Comment** : **notifications navigateur** + vibration, déclenchées par le composant `PrayerTimeReminder` dans l’app (client-side, `setInterval` toutes les 30 s).

**Limitation importante :**  
Ces rappels ne fonctionnent **que si l’utilisateur a l’app ouverte** dans un onglet (même en arrière-plan). Dès que l’onglet est fermé ou le navigateur fermé, il n’y a plus de vérification des horaires ni d’envoi de notification.

Pour avoir des rappels prière **même app fermée**, il faudrait par exemple :
- stocker ville + abonnement push par utilisateur ;
- un cron serveur qui récupère les horaires de prière (API externe) et envoie une Web Push à chaque utilisateur à l’heure voulue.

---

### 3. Rappel « Actions du jour » côté client (9h)

- Le composant `PrayerTimeReminder` envoie aussi une notification à 9h **si l’app est ouverte** (pour éviter de rater le rappel si le cron n’a pas encore tourné ou en dev).
- En production, le **cron + Web Push** reste la source principale ; le client ne fait qu’un doublon quand l’app est ouverte.

---

## Résumé

| Type de notification        | App ouverte | App fermée        |
|----------------------------|------------|--------------------|
| Actions du jour + verset    | Oui        | Oui (cron + push)  |
| Heure de prière (5 min avant) | Oui      | Non (client only)  |

Pour que tout fonctionne côté serveur (y compris rappels prière app fermée), il faudrait étendre le cron et le stockage des préférences (ville, fuseau) par abonnement push.
