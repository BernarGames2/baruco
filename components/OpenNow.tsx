"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/** Status ABERTO/FECHADO calculado no fuso do salão (America/Sao_Paulo). Atualiza a cada minuto. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(getOpenStatus(site.hours, new Date(), site.timezone));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

export function OpenNow({ className = "" }: { className?: string }) {
  const status = useOpenStatus();
  return (
    <p className={`open-now ${className}`} data-open={status?.isOpen ?? "unknown"}>
      <span className={`bulb ${status?.isOpen ? "is-on" : ""}`} aria-hidden="true" />
      <span className="mono open-now-label">
        {status ? (status.isOpen ? "Aberto agora" : "Fechado agora") : "Horário de Uberlândia"}
      </span>
      {status?.detail ? <span className="open-now-detail">· {status.detail}</span> : null}
    </p>
  );
}
