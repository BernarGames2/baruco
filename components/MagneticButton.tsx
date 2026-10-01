"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/motion";
import { scrollToHash } from "@/lib/acts";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  variant?: "gold" | "ghost";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  bulbs?: number;
  size?: "md" | "lg";
};

/** Botão magnético com lâmpadas de camarim que piscam no hover. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "gold",
  className = "",
  external,
  type = "button",
  disabled,
  ariaLabel,
  bulbs = 10,
  size = "md",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const label = labelRef.current;
      if (!el || !label) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const lxTo = gsap.quickTo(label, "x", { duration: 0.5, ease: "power3.out" });
        const lyTo = gsap.quickTo(label, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * 0.32);
          yTo(dy * 0.4);
          lxTo(dx * 0.14);
          lyTo(dy * 0.16);
        };
        const leave = () => {
          gsap.to([el, label], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const cls = `mag mag-${variant} mag-${size} ${disabled ? "is-disabled" : ""} ${className}`;
  const inner = (
    <>
      <span className="mag-bulbs" aria-hidden="true">
        {Array.from({ length: bulbs }, (_, i) => {
          const half = Math.ceil(bulbs / 2);
          const top = i < half;
          const k = top ? i : i - half;
          const per = top ? half : bulbs - half;
          return (
            <span
              key={i}
              className="bulb mag-bulb"
              style={{
                ["--i" as string]: top ? k : half + (per - 1 - k),
                left: `${((k + 0.5) / per) * 100}%`,
                top: top ? "-9px" : "calc(100% + 5px)",
              }}
            />
          );
        })}
      </span>
      <span ref={labelRef} className="mag-label">
        {children}
      </span>
    </>
  );

  if (href && !disabled) {
    const internal = href.startsWith("#");
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          onClick?.(e);
          if (internal && !e.defaultPrevented) {
            e.preventDefault();
            scrollToHash(href);
          }
        }}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {inner}
    </button>
  );
}
