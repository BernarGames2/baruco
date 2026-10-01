"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
  registered = true;
}
registerGsap();

export { gsap, ScrollTrigger, Flip, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 768px)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOTION_REDUCED).matches;
}

/** Hook reativo para media queries (false no SSR). */
export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia(MOTION_REDUCED);
