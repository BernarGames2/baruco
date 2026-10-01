"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { onStageReady } from "@/lib/stage";
import type { RibbonHandle } from "./ribbon-gl";

/* ---------- Fallback SVG: mesma curva em S, gerada no build ---------- */

function sCurve(t: number): [number, number] {
  if (t < 0.5) {
    const a = 0.28 + (1.5 * Math.PI - 0.28) * (t / 0.5);
    return [Math.cos(a) * 1.18, 1 + Math.sin(a)];
  }
  const a = 0.5 * Math.PI + (-Math.PI + 0.28 - 0.5 * Math.PI) * ((t - 0.5) / 0.5);
  return [Math.cos(a) * 1.18, -1 + Math.sin(a)];
}

function ribbonPaths() {
  const N = 180;
  const S = 190;
  const toSvg = ([x, y]: [number, number]) => [300 + x * S, 450 - y * S] as const;
  const left: string[] = [];
  const right: string[] = [];
  const center: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [x, y] = toSvg(sCurve(t));
    const [ax, ay] = toSvg(sCurve(Math.max(0, t - 0.003)));
    const [bx, by] = toSvg(sCurve(Math.min(1, t + 0.003)));
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / len;
    const ny = (bx - ax) / len;
    const twist = 0.35 + 0.95 * Math.sin(t * Math.PI * 3);
    const taper = Math.min(1, t / 0.05, (1 - t) / 0.05);
    const w = 34 * (0.22 + 0.78 * Math.abs(Math.cos(twist))) * Math.max(0, taper);
    left.push(`${(x + nx * w).toFixed(1)},${(y + ny * w).toFixed(1)}`);
    right.push(`${(x - nx * w).toFixed(1)},${(y - ny * w).toFixed(1)}`);
    center.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return {
    fill: `M${left.join("L")}L${right.reverse().join("L")}Z`,
    line: `M${center.join("L")}`,
  };
}

const PATHS = ribbonPaths();

export function RibbonSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 900" className={`ribbon-svg ${className}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rb-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5c4615" />
          <stop offset=".3" stopColor="#C9A24B" />
          <stop offset=".46" stopColor="#F0D58A" />
          <stop offset=".52" stopColor="#FFF6D8" />
          <stop offset=".6" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#5c4615" />
        </linearGradient>
      </defs>
      <g transform="rotate(-14 300 450)">
        <path d={PATHS.fill} fill="url(#rb-metal)" />
        <path d={PATHS.line} fill="none" stroke="#FFF6D8" strokeOpacity=".22" strokeWidth="1" />
        <path className="ribbon-shine" d={PATHS.line} fill="none" stroke="#FFF6D8" strokeWidth="6" strokeLinecap="round" pathLength={1} />
      </g>
    </svg>
  );
}

/* ---------- Componente ---------- */

type Props = {
  /** 0..1 — progresso de rolagem do hero, lido a cada frame pelo shader. */
  progressRef: MutableRefObject<number>;
  className?: string;
};

/**
 * Fita dourada do hero: WebGL (OGL) carregado sob demanda depois que as
 * cortinas abrem; SVG animado como fallback (sem WebGL, Save-Data ou movimento reduzido).
 */
export function GoldRibbon({ progressRef, className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    let handle: RibbonHandle | null = null;
    let cancelled = false;
    const boot = () =>
      import("./ribbon-gl")
        .then(({ createRibbon }) => {
          if (cancelled || !host.current) return;
          handle = createRibbon(host.current, { getProgress: () => progressRef.current });
          if (handle) setGl(true);
        })
        .catch(() => {});

    const off = onStageReady(() => {
      const ric =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300) as unknown as number);
      ric(boot, { timeout: 2000 });
    });
    return () => {
      cancelled = true;
      off();
      handle?.destroy();
    };
  }, [progressRef]);

  return (
    <div className={`gold-ribbon ${className}`} aria-hidden="true">
      <RibbonSvg className={gl ? "is-hidden" : ""} />
      <div ref={host} className="absolute inset-0" />
    </div>
  );
}
