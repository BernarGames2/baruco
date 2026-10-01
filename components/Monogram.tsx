import type { SVGProps } from "react";

/**
 * Monograma "BS" — interpretação vetorial provisória (B serifado + fita em S)
 * sobre círculo azul-noite. TODO A CONFIRMAR: substituir pelos vetores oficiais da logo.
 */
export const B_PATH =
  "M58 52H104C126 52 138 63 138 78C138 90 130 97 119 99.5C134 102 144 111 144 125C144 140 131 148 108 148H58V143H66V57H58Z" +
  "M80 58V96H101C115 96 123 89 123 77.5C123 66 116 58 101 58Z" +
  "M80 103V142H105C121 142 129 136 129 124.5C129 112 122 103 105 103Z";

/** Fita em S que atravessa o B. */
export const S_PATH = "M152 44C128 26 82 34 84 62C86 92 136 94 136 124C136 154 92 166 56 150";

type Props = SVGProps<SVGSVGElement> & {
  /** "badge" = com círculo noite; "mark" = só letras (para fundos já escuros). */
  variant?: "badge" | "mark";
  /** Classes para animar o traço (preloader). */
  drawClass?: string;
  fillClass?: string;
  idPrefix?: string;
  title?: string;
};

export function Monogram({ variant = "badge", drawClass, fillClass, idPrefix = "mg", title, ...rest }: Props) {
  const g = `${idPrefix}-gold`;
  return (
    <svg viewBox="0 0 200 200" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...rest}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A6A24" />
          <stop offset="0.45" stopColor="#F0D58A" />
          <stop offset="0.6" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8A6A24" />
        </linearGradient>
      </defs>
      {variant === "badge" ? (
        <>
          <circle cx="100" cy="100" r="96" fill="#0B1226" />
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke={`url(#${g})`}
            strokeWidth="2"
            pathLength={1}
            className={drawClass}
          />
          <circle cx="100" cy="100" r="86" fill="none" stroke={`url(#${g})`} strokeOpacity=".45" strokeWidth=".75" />
        </>
      ) : null}
      {/* B: traço (desenho) + preenchimento */}
      <path
        d={B_PATH}
        fill="none"
        stroke={`url(#${g})`}
        strokeWidth="1.4"
        pathLength={1}
        className={drawClass}
      />
      <path d={B_PATH} fill={`url(#${g})`} fillRule="evenodd" className={fillClass} />
      {/* Fita em S: contorno noite cria o "entrelaçado" */}
      <path d={S_PATH} fill="none" stroke="#0B1226" strokeWidth="15" strokeLinecap="round" className={fillClass} />
      <path
        d={S_PATH}
        fill="none"
        stroke={`url(#${g})`}
        strokeWidth="8"
        strokeLinecap="round"
        pathLength={1}
        className={drawClass}
      />
      <path
        d={S_PATH}
        fill="none"
        stroke="#FFF6D8"
        strokeOpacity=".55"
        strokeWidth="1.2"
        strokeLinecap="round"
        transform="translate(-1.5 -1.5)"
        className={fillClass}
      />
    </svg>
  );
}
