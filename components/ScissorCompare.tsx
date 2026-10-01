"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { MediaSlot } from "@/content/site";
import { Media } from "@/components/Media";
import { ScissorsIcon } from "@/components/Icons";

type Props = { before: MediaSlot; after: MediaSlot; label?: string };

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/** Antes/depois com puxador em forma de tesoura: arrastar "corta" a imagem. */
export function ScissorCompare({ before, after, label = "Comparar antes e depois" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(50);
  const [snip, setSnip] = useState(0);
  const drag = useRef<{ lastX: number; travel: number } | null>(null);

  const fromX = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    setV(clamp(((x - r.left) / r.width) * 100));
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { lastX: e.clientX, travel: 0 };
    fromX(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.travel += Math.abs(e.clientX - d.lastX);
    d.lastX = e.clientX;
    setSnip((Math.sin(d.travel / 14) + 1) / 2);
    fromX(e.clientX);
  };
  const onUp = () => {
    drag.current = null;
    setSnip(0);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let n: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = v - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") n = v + step;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = 100;
    if (n === null) return;
    e.preventDefault();
    setV(clamp(n));
    setSnip((s) => (s > 0.5 ? 0 : 1));
  };

  return (
    <div
      ref={ref}
      className="compare"
      data-cursor="scissors"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="compare-layer">
        <Media slot={before} sizes="(max-width: 767px) 100vw, 70vw" />
      </div>
      <div className="compare-layer" style={{ clipPath: `inset(0 0 0 ${v}%)` }}>
        <Media slot={after} sizes="(max-width: 767px) 100vw, 70vw" />
      </div>
      <span className="mono compare-tag compare-tag-l">Antes</span>
      <span className="mono compare-tag compare-tag-r">Depois</span>
      <div className="compare-cut" style={{ left: `${v}%` }}>
        <span className="compare-line" aria-hidden="true" />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(v)}
          aria-valuetext={`${Math.round(v)}% antes, ${100 - Math.round(v)}% depois`}
          className="compare-handle"
          onKeyDown={onKey}
        >
          <ScissorsIcon open={snip} className="compare-scissors" />
        </div>
      </div>
    </div>
  );
}
