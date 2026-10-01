import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Trava/destrava a rolagem (overlays: Stories, Roteiro). */
export function lockScroll(lock: boolean) {
  const l = instance;
  if (l) {
    if (lock) l.stop();
    else l.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
