"use client";

import { useRef, useState } from "react";
import { chapters, site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { ChapterIcon } from "@/components/Icons";
import { StoryViewer } from "@/components/StoryViewer";

/** Linha de 8 círculos dourados — os destaques reais do Instagram do salão. */
export function ChapterRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(".chapter", ref.current);
        const rings = gsap.utils.toArray<SVGCircleElement>(".chapter-ring-draw", ref.current);
        gsap.set(rings, { strokeDashoffset: 1 });
        gsap.set(items, { y: 40, autoAlpha: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 82%", once: true } });
        tl.to(items, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: "expo.out" }).to(
          rings,
          { strokeDashoffset: 0, duration: 1.2, stagger: 0.07, ease: "power3.inOut" },
          0.1,
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="rail-wrap">
      <p className="rail-ghost display" aria-hidden="true" key={active}>
        {chapters[active].label}
      </p>
      <ul className="rail" aria-label="Capítulos (destaques do Instagram)">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className="chapter"
              aria-haspopup="dialog"
              aria-label={`Abrir capítulo ${c.label}${c.pending ? " (conteúdo a confirmar)" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => {
                setOpen(i);
                track("story_open", { chapter: c.id });
              }}
            >
              <span className="chapter-ring" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="chapter-ring-svg">
                  <defs>
                    <linearGradient id={`cr-${c.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#F0D58A" />
                      <stop offset=".5" stopColor="#C9A24B" />
                      <stop offset="1" stopColor="#8A6A24" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(201,162,75,.18)" strokeWidth="1" />
                  <circle
                    className="chapter-ring-draw"
                    cx="50"
                    cy="50"
                    r="47"
                    fill="none"
                    stroke={`url(#cr-${c.id})`}
                    strokeWidth="2.5"
                    pathLength={1}
                    strokeDasharray="1"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="chapter-disc">
                  <ChapterIcon name={c.icon} className="chapter-icon" />
                </span>
                {c.pending && site.showPending ? <span className="chapter-pending" /> : null}
              </span>
              <span className="chapter-label">{c.label}</span>
              <span className="chapter-num mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <StoryViewer startIndex={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
