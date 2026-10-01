const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Mantém o Tab dentro do container enquanto o overlay estiver aberto. */
export function trapFocus(container: HTMLElement): () => void {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener("keydown", onKey);
  return () => container.removeEventListener("keydown", onKey);
}
