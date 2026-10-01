/** Pequeno barramento de eventos entre Atos (ex.: Stories → fluxo de reserva). */
export type PrefillDetail = { id: string; label: string; message: string };
const PREFILL = "baruco:prefill";

export function emitPrefill(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL, { detail }));
}

export function onPrefill(cb: (d: PrefillDetail) => void): () => void {
  const h = (e: Event) => cb((e as CustomEvent<PrefillDetail>).detail);
  window.addEventListener(PREFILL, h);
  return () => window.removeEventListener(PREFILL, h);
}
