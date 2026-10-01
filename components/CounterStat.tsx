"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";

type Props = {
  value: number;
  /** Texto final exato (ex.: "19,2 mil") — é o que aparece sem JS. */
  display: string;
  format: "mil" | "int";
  label: string;
  className?: string;
};

const fmt = (v: number, f: Props["format"]) =>
  f === "mil"
    ? `${(v / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mil`
    : Math.round(v).toLocaleString("pt-BR");

/** Contador animado de letreiro (dados reais do perfil). */
export function CounterStat({ value, display, format, label, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = numRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const obj = { v: 0 };
        el.textContent = fmt(0, format);
        gsap.to(obj, {
          v: value,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = fmt(obj.v, format);
          },
          onComplete: () => {
            el.textContent = display;
          },
        });
        return () => {
          el.textContent = display;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`counter ${className}`}>
      <span className="sr-only">
        {display} {label}
      </span>
      <span ref={numRef} className="counter-num mono metal-text" aria-hidden="true">
        {display}
      </span>
      <span className="counter-label mono" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
