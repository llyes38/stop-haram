/**
 * Page de découverte (slides) — affichée à la 1ère connexion après inscription.
 */

const KEY = "stopharam_decouverte_seen";

export function hasDecouverteSeen(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(KEY) === "1";
}

export function setDecouverteSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "1");
}

/** Réinitialise le flag pour qu'un nouveau compte voie les slides de découverte. */
export function clearDecouverteSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
