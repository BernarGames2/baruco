"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/lenis";
import { onStageReady } from "@/lib/stage";

/** Lenis + GSAP ScrollTrigger no mesmo ticker. Desligado com movimento reduzido. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains("preload")) lenis.stop();
    const off = onStageReady(() => lenis.start());

    return () => {
      off();
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
