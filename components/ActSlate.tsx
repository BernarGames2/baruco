"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";
import { KineticTitle } from "@/components/KineticTitle";

type Props = {
  numeral: string;
  title: string;
  titleId: string;
  line?: string;
  className?: string;
};

/**
 * Claquete de Ato: uma cortina curta (0,5s) abre sobre o título
 * quando o Ato entra em cena — e fecha de novo se a pessoa voltar.
 */
export function ActSlate({ numeral, title, titleId, line, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const l = el.querySelector(".curtain-panel.l");
        const r = el.querySelector(".curtain-panel.r");
        gsap.set([l, r], { xPercent: 0 });
        const tl = gsap.timeline({ paused: true });
        tl.to(l, { xPercent: -101, duration: 0.5, ease: "power4.inOut" }).to(
          r,
          { xPercent: 101, duration: 0.5, ease: "power4.inOut" },
          "<",
        );
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            onEnter: () => tl.timeScale(1).play(),
            onLeaveBack: () => tl.timeScale(1.4).reverse(),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className={`act-slate ${className}`}>
      <div className="slate-inner">
        <span className="mono slate-num">
          Ato {numeral} <span aria-hidden="true">/ VI</span>
        </span>
        <KineticTitle as="h2" id={titleId} text={title} className="display slate-title" />
        {line ? <p className="slate-line">{line}</p> : null}
      </div>
      <div className="curtain slate-curtain" aria-hidden="true">
        <div className="curtain-panel l velvet velvet-fringe" />
        <div className="curtain-panel r velvet velvet-fringe" />
      </div>
    </header>
  );
}
