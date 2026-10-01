import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Lâmpadas: lateral esquerda (de baixo p/ cima), topo, lateral direita (de cima p/ baixo). */
  sides?: number;
  top?: number;
};

/**
 * Espelho de camarim com aro dourado e lâmpadas ao redor.
 * A ordem das lâmpadas (data-order) permite acender em onda contornando o espelho.
 */
export function MirrorFrame({ children, className = "", sides = 6, top = 7 }: Props) {
  const bulbs: { x: string; y: string; order: number }[] = [];
  let order = 0;
  for (let i = 0; i < sides; i++) {
    const f = 1 - (i + 0.5) / sides;
    bulbs.push({ x: "calc(var(--band) / 2)", y: `calc(var(--band) + (100% - 2 * var(--band)) * ${f})`, order: order++ });
  }
  for (let i = 0; i < top; i++) {
    const f = (i + 0.5) / top;
    bulbs.push({ x: `calc(var(--band) + (100% - 2 * var(--band)) * ${f})`, y: "calc(var(--band) / 2)", order: order++ });
  }
  for (let i = 0; i < sides; i++) {
    const f = (i + 0.5) / sides;
    bulbs.push({
      x: "calc(100% - var(--band) / 2)",
      y: `calc(var(--band) + (100% - 2 * var(--band)) * ${f})`,
      order: order++,
    });
  }

  return (
    <div className={`mirror ${className}`}>
      <div className="mirror-band" aria-hidden="true" />
      <div className="mirror-glass">{children}</div>
      {bulbs.map((b) => (
        <span
          key={b.order}
          aria-hidden="true"
          className="bulb mirror-bulb"
          style={{ left: b.x, top: b.y, ["--k" as string]: b.order }}
        />
      ))}
    </div>
  );
}
