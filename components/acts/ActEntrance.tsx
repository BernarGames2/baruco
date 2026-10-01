"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { onStageReady } from "@/lib/stage";
import { registerActPosition } from "@/lib/acts";
import { GoldRibbon } from "@/components/GoldRibbon";
import { KineticTitle } from "@/components/KineticTitle";
import { MagneticButton } from "@/components/MagneticButton";
import { MirrorFrame } from "@/components/MirrorFrame";
import { BulbRow } from "@/components/BulbRow";
import { Media } from "@/components/Media";
import { Pending } from "@/components/Pending";

/** Duração (em unidades da timeline) — usada para localizar o Ato II na rolagem. */
const TOTAL = 10;
const ACT2_AT = 3.6;

/**
 * ATO I — ENTRADA EM CENA  +  ATO II — O ESPELHO
 * Um único palco pinado: o círculo "storie" se expande até virar o fundo,
 * o espelho de camarim aparece, as lâmpadas acendem em sequência e o texto
 * surge "refletido".
 */
export function ActEntrance() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(q(".mirror-bulb"), { "--on": 1 });
      });

      mm.add(MOTION_OK, () => {
        const ring = q(".hero-ring")[0] as HTMLElement;
        const ringInner = () => ring.getBoundingClientRect().width / 2 - 9;
        const growMax = () => {
          const w = window.innerWidth;
          const h = el.clientHeight;
          return Math.hypot(w / 2, h / 2) - ringInner() + 40;
        };

        /* --- Entrada (cortinas abrindo) --- */
        gsap.set(el, { "--reveal": 0 });
        gsap.set(ring, { scale: 0.55, autoAlpha: 0, rotate: -50 });
        gsap.set(q(".hero-fade"), { autoAlpha: 0, y: 26 });
        const intro = gsap.timeline({ paused: true });
        intro
          .to(ring, { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.6, ease: "expo.out" }, 0.15)
          .to(el, { "--reveal": 1, duration: 1.5, ease: "expo.inOut" }, 0.3)
          .to(q(".hero-fade"), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "expo.out" }, 0.9);
        const offStage = onStageReady(() => intro.play());

        /* --- Palco pinado: Ato I → Ato II --- */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=360%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current = Math.min(1, self.progress / (3 / TOTAL));
              el.dataset.phase = self.progress > ACT2_AT / TOTAL ? "mirror" : "hero";
            },
          },
        });

        // A: o círculo se expande até preencher a tela
        tl.to(el, { "--grow": () => `${growMax()}px`, duration: 3, ease: "power2.inOut" }, 0)
          .to(ring, { scale: () => (ringInner() + growMax()) / ringInner(), autoAlpha: 0, duration: 3, ease: "power2.inOut" }, 0)
          .to(q(".hero-l1"), { yPercent: -70, autoAlpha: 0, duration: 1.8, ease: "power2.in" }, 0)
          .to(q(".hero-l2"), { scale: 1.3, autoAlpha: 0, duration: 2, ease: "power2.in" }, 0)
          .to(q(".hero-l3"), { yPercent: 70, autoAlpha: 0, duration: 1.8, ease: "power2.in" }, 0)
          .to(q(".hero-fade, .hero-bulbs, .hero-marquee"), { autoAlpha: 0, duration: 0.9 }, 0)
          .to(q(".ribbon-layer"), { autoAlpha: 0, duration: 2.4 }, 0.5)
          .to(q(".portal .ph-label"), { opacity: 1, duration: 0.6 }, 1.4)
          // B: o fundo escurece e vira o Ato II
          .to(q(".portal-dim"), { opacity: 0.8, duration: 1 }, 2.6)
          .to(q(".mirror-act"), { autoAlpha: 1, duration: 0.5 }, 3.1)
          .from(q(".mirror-slate"), { y: 30, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 3.2)
          .fromTo(
            q(".mirror"),
            { scale: 0.8, yPercent: 10, autoAlpha: 0 },
            { scale: 1, yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" },
            3.3,
          )
          // C: lâmpadas acendem em onda ao redor do espelho
          .to(q(".mirror-bulb"), { "--on": 1, duration: 0.3, stagger: 0.09, ease: "power1.out" }, 4.1)
          // D: fotos trocam por máscara + texto "refletido" se resolve
          .fromTo(q(".glass-2"), { "--m": "0%" }, { "--m": "150%", duration: 1.4, ease: "power2.inOut" }, 5.2)
          .fromTo(
            q(".reflect-line"),
            { scaleX: -1, filter: "blur(10px)", autoAlpha: 0.25 },
            { scaleX: 1, filter: "blur(0px)", autoAlpha: 1, duration: 1.2, stagger: 0.55, ease: "power2.out" },
            5.4,
          )
          .fromTo(q(".glass-3"), { "--m": "0%" }, { "--m": "150%", duration: 1.4, ease: "power2.inOut" }, 7.1)
          .from(q(".mirror-copy > *"), { y: 24, autoAlpha: 0, stagger: 0.18, duration: 0.8, ease: "power3.out" }, 7.4)
          .to({}, { duration: TOTAL - 8.6 });

        const st = tl.scrollTrigger!;
        const offAct = registerActPosition("ato-2", () => st.start + (st.end - st.start) * ((ACT2_AT + 0.9) / TOTAL));

        return () => {
          offStage();
          offAct();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const [m1, m2, m3] = site.mirror.media;

  return (
    <div ref={root} className="entrance">
      {/* Camada: foto/vídeo principal dentro do círculo (vira o fundo do Ato II) */}
      <div className="stage-layer portal">
        <Media slot={site.hero.media} priority compact />
        <div className="portal-dim" />
      </div>

      <div className="stage-layer ribbon-layer">
        <GoldRibbon progressRef={progress} className="absolute inset-0" />
      </div>

      <div className="stage-layer ring-layer" aria-hidden="true">
        <div className="hero-ring">
          <span className="ring-gold" />
          <span className="ring-ticks" />
        </div>
      </div>

      {/* ATO I */}
      <section id="ato-1" aria-labelledby="ato-1-title" className="hero">
        <div className="hero-bulbs" aria-hidden="true">
          <BulbRow count={19} mode="stage" size={9} className="hero-bulbs-top" />
        </div>

        <div className="hero-center">
          <p className="hero-kicker mono hero-fade">Baruco Schiavinato · Cabeleireiros</p>
          <h1 id="ato-1-title" className="hero-title display">
            <span className="sr-only">Baruco Schiavinato Cabeleireiros — </span>
            <KineticTitle as="span" text="Seu" trigger="stage" className="hero-line hero-l1" delay={0.2} />
            <KineticTitle as="span" text="Momento" trigger="stage" className="hero-line hero-l2" delay={0.35} />
            <KineticTitle as="span" text="É *aqui*" trigger="stage" className="hero-line hero-l3" delay={0.55} />
          </h1>
          <p className="hero-support hero-fade">{site.supportLine}</p>
          <div className="hero-fade hero-cta">
            <MagneticButton href="#reservar" size="lg">
              Reservar meu horário
            </MagneticButton>
          </div>
        </div>

        <div className="hero-marquee mono" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0">
                {[...site.marquee, ...site.marquee].map((w, i) => (
                  <span key={i} className="px-5">
                    {w} <span className="text-ouro-escuro">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <p className="sr-only">Serviços: {site.marquee.join(", ")}.</p>
      </section>

      {/* ATO II */}
      <section id="ato-2" aria-labelledby="ato-2-title" className="mirror-act">
        <div className="mirror-slate">
          <span className="mono text-ouro">Ato II / VI</span>
          <h2 id="ato-2-title" className="display mirror-title">
            O <em className="metal-text">Espelho</em>
          </h2>
        </div>

        <MirrorFrame className="mirror-size">
          <div className="glass-layer glass-1">
            <Media slot={m1} sizes="(max-width: 767px) 80vw, 60vw" compact />
          </div>
          <div className="glass-layer glass-2">
            <Media slot={m2} sizes="(max-width: 767px) 80vw, 60vw" compact />
          </div>
          <div className="glass-layer glass-3">
            <Media slot={m3} sizes="(max-width: 767px) 80vw, 60vw" compact />
          </div>
          <div className="reflect">
            {site.mirror.lines.map((l, i) => (
              <p key={i} className="reflect-line display">
                {i === 1 ? (
                  <>
                    A gente <em className="metal-text">cuida</em> do resto.
                  </>
                ) : (
                  l
                )}
              </p>
            ))}
          </div>
        </MirrorFrame>

        <div className="mirror-copy">
          <p>{site.mirror.paragraph}</p>
          {site.mirror.story ? <p>{site.mirror.story}</p> : <Pending>história do Baruco</Pending>}
        </div>
      </section>
    </div>
  );
}
