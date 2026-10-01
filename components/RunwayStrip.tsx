"use client";

import { useRef, useState } from "react";
import { looks } from "@/content/site";
import { gsap, useGSAP, MOTION_OK, DESKTOP, FINE_POINTER } from "@/lib/motion";
import { Media } from "@/components/Media";
import { Pending } from "@/components/Pending";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Passarela: faixa horizontal pinada de "looks" em moldura 9:16 de reel,
 * com parallax interno, tilt 3D no hover e contador de cena.
 * Mobile (<768px) ou movimento reduzido: carrossel nativo por swipe.
 */
export function RunwayStrip() {
  const root = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(1);
  const total = looks.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const track = el.querySelector<HTMLElement>(".runway-track")!;
      const cards = gsap.utils.toArray<HTMLElement>(".look", el);
      const lights = gsap.utils.toArray<HTMLElement>(".runway-light", el);
      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${dist() * 1.1}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setScene(Math.min(total, Math.round(self.progress * (total - 1)) + 1));
              const lit = Math.round(self.progress * lights.length);
              lights.forEach((l, i) => l.classList.toggle("is-on", i < lit));
            },
          },
        });
        cards.forEach((card) => {
          const media = card.querySelector(".look-media");
          gsap.fromTo(
            media,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(card.querySelector(".look-frame"), {
            rotateY: -24,
            scale: 0.9,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 105%", end: "left 60%", scrub: true },
          });
        });
      });

      mm.add(`${MOTION_OK} and ${DESKTOP} and ${FINE_POINTER}`, () => {
        const offs = cards.map((card) => {
          const frame = card.querySelector<HTMLElement>(".look-tilt")!;
          const rx = gsap.quickTo(frame, "rotateX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(frame, "rotateY", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 16);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((o) => o());
      });

      // carrossel nativo (mobile / movimento reduzido)
      const onScroll = () => {
        if (!cards[0]) return;
        const w = cards[0].getBoundingClientRect().width + 14;
        setScene(Math.min(total, Math.round(track.scrollLeft / w) + 1));
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        track.removeEventListener("scroll", onScroll);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="runway">
      <div className="runway-head">
        <p className="mono runway-counter" aria-live="off">
          <span className="sr-only">Look </span>
          <span className="metal-text">{pad(scene)}</span>
          <span className="opacity-60"> / {pad(total)}</span>
        </p>
        <p className="mono runway-hint" aria-hidden="true">
          <span className="hidden md:inline">role para desfilar →</span>
          <span className="md:hidden">arraste para o lado →</span>
        </p>
      </div>

      <ul className="runway-track" aria-label="Looks do salão" tabIndex={0}>
        {looks.map((look, i) => (
          <li key={look.media.shot} className="look" data-cursor="scissors">
            <div className="look-tilt">
              <div className="look-frame">
                <div className="look-media">
                  <Media slot={look.media} sizes="(max-width: 767px) 70vw, 24vw" compact />
                </div>
                <div className="look-ui">
                  <span className="mono look-reel">● Reel</span>
                  <span className="mono look-num">
                    {pad(i + 1)}/{pad(total)}
                  </span>
                </div>
                <div className="look-caption">
                  <p className="display look-title">Look {pad(i + 1)}</p>
                  {look.technique ? <p className="look-tech">{look.technique}</p> : <Pending>técnica</Pending>}
                  {look.media.needsAuthorization && !look.media.src ? (
                    <p className="mono look-auth">autorização de imagem pendente</p>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="runway-floor" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="bulb runway-light" />
        ))}
      </div>
    </div>
  );
}
