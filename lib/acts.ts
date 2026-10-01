import { acts } from "@/content/site";
import { getLenis } from "@/lib/lenis";

/**
 * Registro de posições de rolagem dos Atos. Atos dentro de seções pinadas
 * (ex.: Ato II dentro do palco do Ato I) registram uma função própria.
 */
type PosFn = () => number;
const custom = new Map<string, PosFn>();
const listeners = new Set<() => void>();

export function registerActPosition(id: string, fn: PosFn) {
  custom.set(id, fn);
  listeners.forEach((l) => l());
  return () => {
    custom.delete(id);
    listeners.forEach((l) => l());
  };
}

export function onActsChange(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function actScrollY(id: string): number {
  const fn = custom.get(id);
  if (fn) return fn();
  const el = document.getElementById(id);
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function actPositions(): { id: string; y: number }[] {
  return acts.map((a) => ({ id: a.id, y: actScrollY(a.id) }));
}

/** Índice do Ato atual a partir da rolagem. */
export function currentActIndex(scrollY: number, vh: number): number {
  const pos = actPositions();
  let idx = 0;
  pos.forEach((p, i) => {
    if (scrollY + vh * 0.45 >= p.y) idx = i;
  });
  return idx;
}

export function scrollToAct(id: string) {
  const y = actScrollY(id);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: "auto" });
  // move o foco para o Ato (acessibilidade de teclado)
  const el = document.getElementById(id);
  if (el) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

/** Rolagem suave para âncoras internas (#reservar etc.), com foco no destino. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (custom.has(id)) return scrollToAct(id);
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { duration: 1.4, offset: -16 });
  else el.scrollIntoView({ block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
