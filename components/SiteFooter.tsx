"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { B_PATH, S_PATH } from "@/components/Monogram";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/motion";
import { InstagramGlyph } from "@/components/Icons";

/** Rodapé: créditos de fim de sessão + monograma gigante recortado pela borda, com luz que segue o mouse. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const gradRef = useRef<SVGRadialGradientElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const grad = gradRef.current;
      if (!el || !grad) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const svg = el.querySelector("svg.footer-mark") as SVGSVGElement;
        const pos = { x: 100, y: 90 };
        const xTo = gsap.quickTo(pos, "x", { duration: 0.8, ease: "power3.out", onUpdate: () => apply() });
        const yTo = gsap.quickTo(pos, "y", { duration: 0.8, ease: "power3.out", onUpdate: () => apply() });
        const apply = () => {
          grad.setAttribute("cx", String(pos.x));
          grad.setAttribute("cy", String(pos.y));
        };
        const move = (e: PointerEvent) => {
          const r = svg.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width) * 200);
          yTo(((e.clientY - r.top) / r.height) * 200);
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const year = 2026;
  return (
    <footer ref={ref} className="footer">
      <div className="footer-credits">
        <p className="mono footer-kicker">Fim do Ato VI · volte sempre</p>
        <p className="display footer-tagline">
          {site.tagline.replace("!", "")}
          <em className="metal-text">!</em>
        </p>
        <dl className="footer-list">
          <div>
            <dt className="mono">Em cartaz</dt>
            <dd>{site.hoursSummary.open}</dd>
          </div>
          <div>
            <dt className="mono">Endereço</dt>
            <dd>{site.address.oneLine}</dd>
          </div>
          <div>
            <dt className="mono">Telefone</dt>
            <dd>
              <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
            </dd>
          </div>
          <div>
            <dt className="mono">Instagram</dt>
            <dd>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <InstagramGlyph className="h-4 w-4" /> {site.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
        <p className="footer-legal">
          © {year} {site.name}. Site em desenvolvimento — conteúdos marcados “A confirmar” aguardam validação do salão.
          Sem cookies de rastreamento.
        </p>
      </div>

      <div className="footer-mark-wrap" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="footer-mark">
          <defs>
            <radialGradient id="footer-glow" ref={gradRef} cx="100" cy="90" r="90" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF6D8" />
              <stop offset=".18" stopColor="#F0D58A" />
              <stop offset=".45" stopColor="#C9A24B" />
              <stop offset=".8" stopColor="#8A6A24" />
              <stop offset="1" stopColor="#4a3812" />
            </radialGradient>
          </defs>
          <path d={B_PATH} fill="url(#footer-glow)" fillRule="evenodd" />
          <path d={S_PATH} fill="none" stroke="#0B1226" strokeWidth="15" strokeLinecap="round" />
          <path d={S_PATH} fill="none" stroke="url(#footer-glow)" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    </footer>
  );
}
