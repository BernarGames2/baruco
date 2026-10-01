"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { emitStageReady } from "@/lib/stage";
import { Monogram } from "@/components/Monogram";

export const VISIT_KEY = "baruco-camarim";

/**
 * Preloader "Cortinas": veludo fechado, contador 000→100, monograma desenhado
 * em ouro; as cortinas abrem e revelam o hero. Pulado em visita repetida
 * (sessionStorage) e com movimento reduzido (decidido no script inline do <head>).
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    (window as Window & { __barucoPreloader?: boolean }).__barucoPreloader = true;
    const html = document.documentElement;
    const el = ref.current;
    if (!el || !html.classList.contains("preload")) {
      setGone(true);
      return;
    }
    el.classList.add("is-active");
    const counter = el.querySelector(".pl-count")!;
    const draws = el.querySelectorAll(".pl-draw");
    const fills = el.querySelectorAll(".pl-fill");
    gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(fills, { opacity: 0 });

    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => window.setTimeout(r, 2200)),
    ]);
    const c = { v: 0 };
    const tl = gsap.timeline();
    tl.to(
      c,
      {
        v: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          counter.textContent = String(Math.round(c.v)).padStart(3, "0");
        },
      },
      0,
    )
      .to(draws, { strokeDashoffset: 0, duration: 1.3, stagger: 0.1, ease: "power2.inOut" }, 0)
      .to(fills, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0.95)
      .add(() => {
        tl.pause();
        fontsReady.then(() => tl.resume());
      })
      .to(el.querySelector(".pl-center"), { autoAlpha: 0, scale: 0.94, duration: 0.4, ease: "power2.in" }, "+=0.1")
      .add(() => {
        try {
          sessionStorage.setItem(VISIT_KEY, "1");
        } catch {
          /* modo privado */
        }
        emitStageReady();
      })
      .to(el.querySelector(".curtain-panel.l"), { xPercent: -101, duration: 1.25, ease: "power4.inOut" }, "<0.05")
      .to(el.querySelector(".curtain-panel.r"), { xPercent: 101, duration: 1.25, ease: "power4.inOut" }, "<")
      .to(el.querySelector(".pl-valance"), { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "<0.35")
      .add(() => setGone(true));
    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="curtain-panel l velvet velvet-fringe" />
      <div className="curtain-panel r velvet velvet-fringe" />
      <div className="pl-valance velvet" />
      <div className="pl-center">
        <Monogram className="pl-mono" drawClass="pl-draw" fillClass="pl-fill" idPrefix="pl" />
        <span className="pl-count mono">000</span>
        <span className="pl-label mono">Preparando o camarim</span>
      </div>
    </div>
  );
}
