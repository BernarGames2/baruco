"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { acts } from "@/content/site";
import { actScrollY, onActsChange, scrollToAct } from "@/lib/acts";
import { ScrollTrigger } from "@/lib/motion";

const H = 1000;
const xAt = (y: number) => 20 + 7 * Math.sin(y / 34) + 3 * Math.sin(y / 11);

/**
 * Fio dourado contínuo à esquerda que "costura" os Atos: a parte já percorrida
 * brilha (stroke-dashoffset), o resto fica em pontos de costura.
 */
export function GoldThread() {
  const drawRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const d = useMemo(() => {
    const pts: string[] = [];
    for (let y = 0; y <= H; y += 5) pts.push(`${xAt(y).toFixed(2)},${y}`);
    return `M${pts.join("L")}`;
  }, []);

  useEffect(() => {
    const total = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const measure = () => setNodes(acts.map((a) => Math.min(1, actScrollY(a.id) / total())));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const p = Math.min(1, window.scrollY / total());
        if (drawRef.current) drawRef.current.style.strokeDashoffset = String(1 - p);
        if (needleRef.current) {
          needleRef.current.style.top = `${p * 100}%`;
          needleRef.current.style.left = `${(xAt(p * H) / 40) * 100}%`;
        }
        setProgress(p);
      });
    };
    measure();
    onScroll();
    ScrollTrigger.addEventListener("refresh", measure);
    const off = onActsChange(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      off();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="thread" aria-hidden="true">
      <svg viewBox={`0 0 40 ${H}`} preserveAspectRatio="none" className="thread-svg">
        <defs>
          <linearGradient id="thread-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0D58A" />
            <stop offset=".5" stopColor="#C9A24B" />
            <stop offset="1" stopColor="#8A6A24" />
          </linearGradient>
        </defs>
        <path d={d} className="thread-stitch" pathLength={1} />
        <path ref={drawRef} d={d} className="thread-draw" pathLength={1} stroke="url(#thread-g)" />
      </svg>
      <span ref={needleRef} className="thread-needle" />
      {nodes.map((f, i) => (
        <button
          key={acts[i].id}
          type="button"
          tabIndex={-1}
          className={`thread-node ${progress + 0.002 >= f ? "is-on" : ""}`}
          style={{ top: `${f * 100}%`, left: `${(xAt(f * H) / 40) * 100}%` }}
          onClick={() => scrollToAct(acts[i].id)}
        >
          <span className="bulb" />
          <span className="thread-label mono">
            {acts[i].numeral} · {acts[i].short}
          </span>
        </button>
      ))}
    </div>
  );
}
