"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";

/** Parallax por camadas nas fotos presas no mural. */
export function ParallaxPins({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".polaroid", ref.current).forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40 + (i % 3) * 30 },
            {
              y: -(20 + (i % 3) * 25),
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="mural-pins">
      {children}
    </div>
  );
}
