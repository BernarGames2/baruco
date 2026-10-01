"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/motion";
import { onStageReady } from "@/lib/stage";
import { splitChars } from "@/lib/split";

type Props = {
  /** Use *palavra* para itálico dourado com brilho; "\n" quebra linha. */
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
  lineClassName?: string;
  trigger?: "scroll" | "stage";
  delay?: number;
  stagger?: number;
};

type Word = { text: string; italic: boolean };

function parse(text: string): Word[][] {
  return text.split("\n").map((line) => {
    const words: Word[] = [];
    line.split(/(\*[^*]+\*)/g).forEach((seg) => {
      if (!seg) return;
      const italic = seg.startsWith("*") && seg.endsWith("*");
      const clean = italic ? seg.slice(1, -1) : seg;
      clean.split(" ").forEach((w) => w && words.push({ text: w, italic }));
    });
    return words;
  });
}

/**
 * Tipografia cinética: letras entram uma a uma com leve rotação 3D;
 * palavras em *itálico* recebem um brilho dourado que varre 1x.
 * (Equivalente próprio ao SplitText; leitores de tela recebem a frase inteira.)
 */
export function KineticTitle({
  text,
  as: Tag = "h2",
  id,
  className = "",
  lineClassName = "",
  trigger = "scroll",
  delay = 0,
  stagger = 0.035,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const lines = parse(text);
  const plain = text.replace(/\*/g, "").replace(/\n/g, " ");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const chars = root.querySelectorAll<HTMLElement>(".kt-char");
      const italics = root.querySelectorAll<HTMLElement>(".kt-italic");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(chars, { y: 0, yPercent: 108, rotateX: -70, opacity: trigger === "stage" ? 1 : 0 });
        if (italics.length) gsap.set(italics, { "--shine": 110 });
        const tl = gsap.timeline({ paused: true, delay });
        tl.to(chars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.15, ease: "expo.out", stagger });
        if (italics.length) tl.to(italics, { "--shine": 18, duration: 1.6, ease: "power2.inOut" }, "-=0.75");

        if (trigger === "stage") return onStageReady(() => tl.play());
        gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 86%", once: true, onEnter: () => tl.play() },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  let idx = 0;
  return (
    <Tag ref={ref} id={id} className={className} data-kt={trigger}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true" className="kt" style={{ perspective: "800px" }}>
        {lines.map((words, li) => (
          <span key={li} className={`block ${lineClassName}`}>
            {words.map((w, wi) => {
              const chars = splitChars(w.text);
              return (
                <span key={wi}>
                  <span className={`kt-word ${w.italic ? "kt-italic" : ""}`}>
                    {chars.map((c, ci) => (
                      <span key={c.key} className="kt-char" style={{ ["--i" as string]: ci, ["--n" as string]: idx++ }}>
                        {c.char}
                      </span>
                    ))}
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}
