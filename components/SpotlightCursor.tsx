"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK, FINE_POINTER } from "@/lib/motion";
import { ScissorsIcon } from "@/components/Icons";

/**
 * HOLOFOTE: cursor = spotlight macio dourado (blend soft-light) que ilumina o que
 * passa por baixo; vira tesoura sobre os looks. Desligado em touch e movimento reduzido.
 */
export function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(`${MOTION_OK} and ${FINE_POINTER}`);
    if (!mq.matches) return;
    const html = document.documentElement;
    html.classList.add("has-spotlight");
    const halo = el.querySelector(".spot-halo")!;
    const dot = el.querySelector(".spot-dot")!;
    const sc = el.querySelector(".spot-scissors")!;
    const hx = gsap.quickTo(halo, "x", { duration: 0.7, ease: "power3.out" });
    const hy = gsap.quickTo(halo, "y", { duration: 0.7, ease: "power3.out" });
    const dx = gsap.quickTo([dot, sc], "x", { duration: 0.12, ease: "power2.out" });
    const dy = gsap.quickTo([dot, sc], "y", { duration: 0.12, ease: "power2.out" });
    let mode = "";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.dataset.visible = "true";
      hx(e.clientX);
      hy(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      const t = e.target as Element | null;
      const next = t?.closest?.('[data-cursor="scissors"]')
        ? "scissors"
        : t?.closest?.("a, button, label, [role='slider'], input, select, textarea")
          ? "link"
          : "default";
      if (next !== mode) {
        mode = next;
        el.dataset.mode = mode;
      }
    };
    const down = () => (el.dataset.down = "true");
    const up = () => (el.dataset.down = "false");
    const leave = () => (el.dataset.visible = "false");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-spotlight");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="spot" aria-hidden="true" data-visible="false" data-mode="default">
      <div className="spot-halo" />
      <div className="spot-dot" />
      <div className="spot-scissors">
        <ScissorsIcon className="h-9 w-9" open={0.6} />
      </div>
    </div>
  );
}
