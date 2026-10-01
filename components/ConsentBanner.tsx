"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { CONSENT_KEY } from "@/lib/analytics";

/**
 * Aviso de cookies (LGPD) — só existe quando `site.analytics.enabled` = true.
 * Nenhum script de analytics é carregado antes do aceite.
 */
export function ConsentBanner() {
  const [state, setState] = useState<"unknown" | "granted" | "denied">("unknown");

  useEffect(() => {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      if (v === "granted" || v === "denied") setState(v);
    } catch {
      /* sem storage */
    }
  }, []);

  useEffect(() => {
    if (state !== "granted" || !site.analytics.enabled || !site.analytics.id) return;
    const s = document.createElement("script");
    s.async = true;
    if (site.analytics.provider === "ga4") {
      s.src = `https://www.googletagmanager.com/gtag/js?id=${site.analytics.id}`;
      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = (...a: unknown[]) => w.dataLayer!.push(a);
      w.gtag("js", new Date());
      w.gtag("config", site.analytics.id, { anonymize_ip: true });
    } else if (site.analytics.provider === "plausible") {
      s.src = "https://plausible.io/js/script.js";
      s.dataset.domain = site.analytics.id;
    }
    document.head.appendChild(s);
  }, [state]);

  if (!site.analytics.enabled || state !== "unknown") return null;

  const decide = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* sem storage */
    }
    setState(v);
  };

  return (
    <div className="consent" role="region" aria-label="Aviso de cookies">
      <p>Usamos cookies de medição de audiência só com a sua permissão.</p>
      <div className="flex gap-3">
        <button type="button" className="mag mag-ghost mag-md" onClick={() => decide("denied")}>
          <span className="mag-label">Recusar</span>
        </button>
        <button type="button" className="mag mag-gold mag-md" onClick={() => decide("granted")}>
          <span className="mag-label">Aceitar</span>
        </button>
      </div>
    </div>
  );
}
