import { site } from "@/content/site";

/**
 * Analytics DESLIGADO por padrão (LGPD). Só envia eventos se
 * `site.analytics.enabled` e a pessoa aceitou no aviso de cookies.
 */
export const CONSENT_KEY = "baruco-consent";

export function hasConsent(): boolean {
  if (!site.analytics.enabled) return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

type W = Window & { gtag?: (...a: unknown[]) => void; plausible?: (e: string, o?: unknown) => void };

export function track(event: string, props: Record<string, string> = {}) {
  if (!hasConsent()) return;
  const w = window as W;
  if (site.analytics.provider === "ga4") w.gtag?.("event", event, props);
  if (site.analytics.provider === "plausible") w.plausible?.(event, { props });
}

/** Vibração curta (mobile), se suportado e sem movimento reduzido. */
export function haptic(ms = 18) {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigator.vibrate?.(ms);
  } catch {
    /* sem suporte */
  }
}
