import type { CSSProperties } from "react";

type Props = {
  /** "closed" cobre o conteúdo; "open" recolhe para as laterais. */
  state?: "open" | "closed";
  /** "css" usa transição CSS; "gsap" deixa o pai animar `.curtain-panel.l/.r`. */
  animate?: "css" | "gsap";
  duration?: number;
  fringe?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Cortinas de veludo azul-noite em duas metades. */
export function Curtain({ state = "closed", animate = "css", duration = 0.7, fringe = true, className = "", style }: Props) {
  return (
    <div
      className={`curtain ${className}`}
      data-state={state}
      data-animate={animate}
      aria-hidden="true"
      style={{ ["--curtain-d" as string]: `${duration}s`, ...style }}
    >
      <div className={`curtain-panel l velvet ${fringe ? "velvet-fringe" : ""}`} />
      <div className={`curtain-panel r velvet ${fringe ? "velvet-fringe" : ""}`} />
    </div>
  );
}
