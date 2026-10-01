"use client";

import { useEffect, useRef, useState } from "react";
import { acts, site } from "@/content/site";
import { currentActIndex, onActsChange, scrollToAct } from "@/lib/acts";
import { lockScroll } from "@/lib/lenis";
import { trapFocus } from "@/lib/focus-trap";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { Monogram } from "@/components/Monogram";
import { Curtain } from "@/components/Curtain";
import { OpenNow } from "@/components/OpenNow";

/**
 * Navegação própria: indicador de cena (Ato atual) + "Roteiro" — um programa
 * de teatro que abre com cortinas, em vez de menu de links.
 */
export function ScriptNav() {
  const [act, setAct] = useState(0);
  const [open, setOpen] = useState(false);
  const [curtain, setCurtain] = useState<"open" | "closed">("open");
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ato atual
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setAct(currentActIndex(window.scrollY, window.innerHeight));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const off = onActsChange(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      off();
      cancelAnimationFrame(raf);
    };
  }, []);

  // abrir/fechar com cortina
  const show = () => {
    setOpen(true);
    lockScroll(true);
    requestAnimationFrame(() => setCurtain("closed"));
  };
  const hide = (then?: () => void) => {
    setCurtain("open");
    const d = prefersReducedMotion() ? 50 : 600;
    window.setTimeout(() => {
      setOpen(false);
      lockScroll(false);
      then?.();
      if (!then) btnRef.current?.focus({ preventScroll: true });
    }, d);
  };

  useEffect(() => {
    if (!open || !overlayRef.current) return;
    const el = overlayRef.current;
    const release = trapFocus(el);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    el.addEventListener("keydown", onKey);
    const items = el.querySelectorAll(".script-item");
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        items,
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, delay: 0.45, ease: "expo.out" },
      );
    }
    window.setTimeout(() => el.querySelector<HTMLElement>(".script-close")?.focus({ preventScroll: true }), 50);
    return () => {
      release();
      el.removeEventListener("keydown", onKey);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = acts[act];

  return (
    <>
      <header className="topbar">
        <a href="#ato-1" className="topbar-mark" aria-label={`${site.name} — início`} onClick={(e) => {
          e.preventDefault();
          scrollToAct("ato-1");
        }}>
          <Monogram className="h-11 w-11" idPrefix="nav" />
        </a>
        <p className="topbar-act mono" aria-hidden="true">
          <span className="topbar-act-num">Ato {current.numeral}</span>
          <span className="topbar-act-title"> · {current.title}</span>
        </p>
        <button
          ref={btnRef}
          type="button"
          className="topbar-script"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={show}
        >
          <span className="topbar-bulbs" aria-hidden="true">
            <span className="bulb is-on" />
            <span className="bulb is-on" />
            <span className="bulb is-on" />
          </span>
          <span className="mono">Roteiro</span>
        </button>
      </header>

      {open ? (
        <div ref={overlayRef} className="script" role="dialog" aria-modal="true" aria-labelledby="script-title">
          <Curtain state={curtain} duration={0.55} className="script-curtain" />
          <div className={`script-body ${curtain === "closed" ? "is-in" : ""}`}>
            <div className="script-head">
              <p id="script-title" className="mono">
                Roteiro · {site.shortName}
              </p>
              <button type="button" className="script-close mono" onClick={() => hide()}>
                Fechar ✕
              </button>
            </div>
            <nav aria-label="Atos do site">
              <ol className="script-list">
                {acts.map((a, i) => (
                  <li key={a.id} className="script-item">
                    <a
                      href={`#${a.id}`}
                      aria-current={i === act ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        hide(() => scrollToAct(a.id));
                      }}
                    >
                      <span className="mono script-num">Ato {a.numeral}</span>
                      <span className="display script-name">{a.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="script-foot">
              <OpenNow />
              <p>{site.address.oneLine}</p>
              <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
