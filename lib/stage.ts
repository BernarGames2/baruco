/**
 * "Palco liberado": disparado quando as cortinas do preloader começam a abrir
 * (ou imediatamente, se não houver preloader nesta visita).
 */
const EVT = "baruco:stage-ready";

export function isStageReady(): boolean {
  return !document.documentElement.classList.contains("preload");
}

export function onStageReady(cb: () => void): () => void {
  if (isStageReady()) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener(EVT, h, { once: true });
  return () => window.removeEventListener(EVT, h);
}

export function emitStageReady() {
  document.documentElement.classList.remove("preload");
  window.dispatchEvent(new Event(EVT));
}
