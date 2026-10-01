"use client";

import { site } from "@/content/site";
import { formatHour } from "@/lib/hours";
import { useOpenStatus } from "@/components/OpenNow";
import { StarIcon } from "@/components/Icons";
import { Pending } from "@/components/Pending";

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // segunda → domingo

/** "Ficha de camarim": horários reais + indicador ABERTO AGORA no fuso de Uberlândia. */
export function GreenroomCard() {
  const status = useOpenStatus();

  return (
    <article className="ficha" aria-labelledby="ficha-title">
      <div className="ficha-star" aria-hidden="true">
        <StarIcon className="ficha-star-icon" id="ficha-star-g" />
      </div>
      <p className="mono ficha-kicker">Porta do camarim</p>
      <h3 id="ficha-title" className="display ficha-title">
        Ficha de <em>camarim</em>
      </h3>

      <p className="ficha-status" data-open={status?.isOpen ?? "unknown"}>
        <span className={`bulb ${status?.isOpen ? "is-on" : ""}`} aria-hidden="true" />
        <span className="mono">
          {status ? (status.isOpen ? "Aberto agora" : "Fechado agora") : "Consultando horário…"}
        </span>
        {status?.detail ? <span className="ficha-detail">{status.detail}</span> : null}
      </p>

      <dl className="ficha-hours">
        {ORDER.map((d) => {
          const h = site.hours.find((x) => x.day === d)!;
          const today = status?.today === d;
          return (
            <div key={d} className={`ficha-row ${today ? "is-today" : ""}`}>
              <dt>
                {h.label}
                {today ? <span className="mono ficha-today"> · hoje</span> : null}
              </dt>
              <dd className="mono">{h.open && h.close ? `${formatHour(h.open)} – ${formatHour(h.close)}` : "Fechado"}</dd>
            </div>
          );
        })}
      </dl>
      <p className="mono ficha-tz">Horário de Brasília · Uberlândia/MG</p>
      <Pending>horários (fonte: Google)</Pending>
    </article>
  );
}
