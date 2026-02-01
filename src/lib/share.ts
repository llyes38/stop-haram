/** URL de l'app — centralisée pour le partage */
export const APP_URL = "https://stop-haram.vercel.app";

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export type ShareOptions = {
  title: string;
  text: string;
  url: string;
};

export async function shareWithNative(options: ShareOptions): Promise<boolean> {
  if (!canShare()) return false;
  try {
    await navigator.share({
      title: options.title,
      text: options.text,
      url: options.url,
    });
    return true;
  } catch (err) {
    if ((err as Error).name === "AbortError") return false;
    return false;
  }
}
