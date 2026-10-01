"use client";

import { useState } from "react";
import { site } from "@/content/site";

/** Mapa do Google carregado só com clique (terceiros/LGPD + performance). */
export function MapFacade() {
  const [load, setLoad] = useState(false);
  const q = encodeURIComponent(site.address.mapsQuery);

  return (
    <div className="map">
      {load ? (
        <iframe
          title={`Mapa: ${site.name}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-facade">
          <svg viewBox="0 0 400 260" className="map-art" aria-hidden="true">
            <g fill="none" stroke="rgba(201,162,75,.35)" strokeWidth="1.2">
              <path d="M-10 70 L410 40" />
              <path d="M-10 150 L410 120" />
              <path d="M-10 230 L410 205" />
              <path d="M60 -10 L90 270" />
              <path d="M170 -10 L195 270" />
              <path d="M290 -10 L310 270" />
              <path d="M-10 20 L230 270" strokeDasharray="4 6" />
            </g>
            <g transform="translate(200 78)">
              <circle r="30" fill="rgba(240,213,138,.12)" />
              <circle r="15" fill="rgba(240,213,138,.25)" />
              <path d="M0 -22c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="#C9A24B" />
              <circle r="5.5" cy="-6" fill="#0B1226" />
            </g>
          </svg>
          <p className="mono map-caption">Ilustração · {site.address.street}</p>
          <button type="button" className="mag mag-ghost mag-md" onClick={() => setLoad(true)}>
            <span className="mag-label">Carregar mapa (Google Maps)</span>
          </button>
          <p className="map-note">O mapa vem do Google e pode usar cookies.</p>
        </div>
      )}
    </div>
  );
}
