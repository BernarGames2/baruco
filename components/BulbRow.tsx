"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { onStageReady } from "@/lib/stage";

type Props = {
  count: number;
  className?: string;
  /** "scroll" acende em onda ao entrar na tela; "lit" já nasce acesa; "stage" acende quando o palco abre. */
  mode?: "scroll" | "lit" | "stage";
  size?: number;
  vertical?: boolean;
};

/** Fileira de lâmpadas de camarim que acendem em onda. */
export function BulbRow({ count, className = "", mode = "scroll", size = 10, vertical }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bulbs = ref.current?.querySelectorAll<HTMLElement>(".bulb");
      if (!bulbs?.length || mode === "lit") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_REDUCED, () => {
        gsap.set(bulbs, { "--on": 1 });
      });
      mm.add(MOTION_OK, () => {
        const light = () =>
          gsap.to(bulbs, {
            "--on": 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.07, from: "start" },
          });
        if (mode === "stage") return onStageReady(() => light());
        gsap.set(bulbs, { "--on": 0 });
        gsap.to(bulbs, {
          "--on": 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [mode] },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`flex ${vertical ? "flex-col" : ""} items-center justify-between ${className}`}
      style={{ ["--bulb" as string]: `${size}px` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`bulb ${mode === "lit" ? "is-on" : ""}`} />
      ))}
    </div>
  );
}
