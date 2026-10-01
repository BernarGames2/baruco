"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { createPortal } from "react-dom";
import { chapters, site, type Chapter, type StoryFrame } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";
import { trapFocus } from "@/lib/focus-trap";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { emitPrefill } from "@/lib/bus";
import { scrollToHash } from "@/lib/acts";
import { haptic, track } from "@/lib/analytics";
import { ChapterIcon, WhatsAppGlyph } from "@/components/Icons";
import { Media } from "@/components/Media";
import { OpenNow } from "@/components/OpenNow";
import { Pending } from "@/components/Pending";

const FRAME_MS = 6;
const HOLD_MS = 220;

type Pos = { ci: number; fi: number };

type Props = {
  startIndex: number;
  onClose: () => void;
};

/**
 * Visualizador fullscreen estilo Stories: barras de progresso, toque nas bordas,
 * swipe, setas, teclado (←/→/Esc/Espaço), auto-avanço de 6s com pausa ao segurar
 * e transição por wipe radial.
 */
export function StoryViewer({ startIndex, onClose }: Props) {
  const [pos, setPos] = useState<Pos>({ ci: startIndex, fi: 0 });
  const [under, setUnder] = useState<Pos | null>(null);
  const [manualPause, setManualPause] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced] = useState(() => prefersReducedMotion());
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const origin = useRef({ x: 50, y: 50 });
  const pointer = useRef<{ x: number; y: number; t: number; timer: number; held: boolean } | null>(null);

  const chapter = chapters[pos.ci];
  const frames = chapter.frames;
  const isLast = pos.fi === frames.length - 1;
  const paused = manualPause || holding || hidden || reduced;

  const go = useCallback(
    (next: Pos, from?: { x: number; y: number }) => {
      origin.current = from ?? { x: 50, y: 50 };
      setUnder(pos);
      setPos(next);
    },
    [pos],
  );

  const next = useCallback(
    (from?: { x: number; y: number }) => {
      const { ci, fi } = pos;
      if (fi < chapters[ci].frames.length - 1) go({ ci, fi: fi + 1 }, from ?? { x: 90, y: 50 });
      else if (ci < chapters.length - 1) go({ ci: ci + 1, fi: 0 }, from ?? { x: 90, y: 50 });
      else onClose();
    },
    [pos, go, onClose],
  );

  const prev = useCallback(
    (from?: { x: number; y: number }) => {
      const { ci, fi } = pos;
      if (fi > 0) go({ ci, fi: fi - 1 }, from ?? { x: 10, y: 50 });
      else if (ci > 0) go({ ci: ci - 1, fi: chapters[ci - 1].frames.length - 1 }, from ?? { x: 10, y: 50 });
      else go({ ci, fi }, from ?? { x: 10, y: 50 });
    },
    [pos, go],
  );

  const nextChapter = useCallback(() => {
    if (pos.ci < chapters.length - 1) go({ ci: pos.ci + 1, fi: 0 }, { x: 100, y: 50 });
    else onClose();
  }, [pos, go, onClose]);
  const prevChapter = useCallback(() => {
    if (pos.ci > 0) go({ ci: pos.ci - 1, fi: 0 }, { x: 0, y: 50 });
  }, [pos, go]);

  const nextRef = useRef(next);
  nextRef.current = next;

  /* montagem: portal, trava de rolagem, foco */
  useEffect(() => {
    setMounted(true);
    const opener = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      lockScroll(false);
      document.removeEventListener("visibilitychange", onVis);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!mounted || !rootRef.current) return;
    closeRef.current?.focus({ preventScroll: true });
    return trapFocus(rootRef.current);
  }, [mounted]);

  /* auto-avanço de 6s */
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    const obj = { p: 0 };
    fill.style.transform = reduced ? "scaleX(1)" : "scaleX(0)";
    if (reduced) return;
    const tw = gsap.to(obj, {
      p: 1,
      duration: FRAME_MS,
      ease: "none",
      onUpdate: () => {
        fill.style.transform = `scaleX(${obj.p})`;
      },
      onComplete: () => nextRef.current(),
    });
    tweenRef.current = tw;
    return () => {
      tw.kill();
    };
  }, [pos, reduced, mounted]);

  useEffect(() => {
    const tw = tweenRef.current;
    if (!tw) return;
    if (paused) tw.pause();
    else tw.resume();
  }, [paused, pos]);

  /* wipe radial na troca de quadro */
  useLayoutEffect(() => {
    const el = topRef.current;
    if (!el || !under) return;
    const { x, y } = origin.current;
    if (reduced) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, onComplete: () => setUnder(null) });
      return;
    }
    gsap.fromTo(
      el,
      { clipPath: `circle(0% at ${x}% ${y}%)` },
      {
        clipPath: `circle(150% at ${x}% ${y}%)`,
        duration: 0.75,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(el, { clearProps: "clipPath" });
          setUnder(null);
        },
      },
    );
  }, [pos]); // eslint-disable-line react-hooks/exhaustive-deps

  /* teclado */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === " " && !(e.target as HTMLElement).closest("a,button")) {
      e.preventDefault();
      setManualPause((p) => !p);
    }
  };

  /* toque / segurar / swipe */
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    const timer = window.setTimeout(() => {
      if (pointer.current) pointer.current.held = true;
      setHolding(true);
    }, HOLD_MS);
    pointer.current = { x: e.clientX, y: e.clientY, t: Date.now(), timer, held: false };
  };
  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p) return;
    window.clearTimeout(p.timer);
    if (p.held) {
      setHolding(false);
      return;
    }
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    const rect = e.currentTarget.getBoundingClientRect();
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextChapter();
      else prevChapter();
      return;
    }
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      onClose();
      return;
    }
    const from = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (e.clientX - rect.left < rect.width * 0.3) prev(from);
    else next(from);
  };
  const onPointerCancel = () => {
    if (pointer.current) window.clearTimeout(pointer.current.timer);
    pointer.current = null;
    setHolding(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="story-viewer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-chapter-label"
      onKeyDown={onKeyDown}
    >
      <div className="story-backdrop" onClick={onClose} aria-hidden="true" />

      <button type="button" className="story-side story-side-prev" onClick={() => prev()} aria-label="Quadro anterior">
        <span aria-hidden="true">←</span>
      </button>

      <div className="story-card">
        <div
          className="story-stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
        >
          {under ? (
            <div className="story-frame" aria-hidden="true">
              <FrameView chapter={chapters[under.ci]} frame={chapters[under.ci].frames[under.fi]} isLast={false} />
            </div>
          ) : null}
          <div ref={topRef} className="story-frame is-top" key={`${pos.ci}-${pos.fi}`}>
            <FrameView chapter={chapter} frame={frames[pos.fi]} isLast={isLast} onCta={onClose} />
          </div>
        </div>

        {/* topo: progresso + cabeçalho */}
        <div className="story-top">
          <div className="story-bars" aria-hidden="true">
            {frames.map((_, i) => (
              <span key={i} className="story-bar">
                <span
                  ref={i === pos.fi ? fillRef : undefined}
                  className="story-bar-fill"
                  style={{ transform: i < pos.fi ? "scaleX(1)" : i > pos.fi ? "scaleX(0)" : undefined }}
                />
              </span>
            ))}
          </div>
          <div className="story-head">
            <span className="story-avatar" aria-hidden="true">
              <ChapterIcon name={chapter.icon} className="h-5 w-5 text-ouro-claro" />
            </span>
            <span className="story-who">
              <strong id="story-chapter-label">{chapter.label}</strong>
              <span className="mono">{site.instagram.handle}</span>
            </span>
            {!reduced ? (
              <button
                type="button"
                className="story-btn"
                onClick={() => setManualPause((p) => !p)}
                aria-label={manualPause ? "Continuar" : "Pausar"}
                aria-pressed={manualPause}
              >
                {manualPause ? "▶" : "❚❚"}
              </button>
            ) : null}
            <button ref={closeRef} type="button" className="story-btn" onClick={onClose} aria-label="Fechar stories">
              ✕
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {`${chapter.label}: quadro ${pos.fi + 1} de ${frames.length}. ${frames[pos.fi].title}.`}
        </p>
      </div>

      <button type="button" className="story-side story-side-next" onClick={() => next()} aria-label="Próximo quadro">
        <span aria-hidden="true">→</span>
      </button>

      <p className="story-hint mono" aria-hidden="true">
        toque nas bordas · segure para pausar · arraste para trocar de capítulo
      </p>
    </div>,
    document.body,
  );
}

function FrameView({
  chapter,
  frame,
  isLast,
  onCta,
}: {
  chapter: Chapter;
  frame: StoryFrame;
  isLast: boolean;
  onCta?: () => void;
}) {
  const msg = bookingMessage({ service: chapter.serviceForMessage });
  const link = whatsappLink(msg);

  return (
    <>
      <Media slot={frame.media} sizes="(max-width: 767px) 100vw, 480px" />
      <div className="story-shade" aria-hidden="true" />
      <div className="story-content">
        <p className="mono story-kicker">{frame.kicker}</p>
        <h3 className="display story-title">{frame.title}</h3>
        <p className="story-caption">{frame.caption}</p>
        {frame.showHours ? (
          <div className="story-hours">
            <OpenNow />
            <p className="mono">{site.hoursSummary.open}</p>
            <p className="mono">{site.hoursSummary.closed}</p>
          </div>
        ) : null}
        {frame.services?.length ? (
          <ul className="story-services">
            {frame.services.map((s) => (
              <li key={s.name}>
                <span>{s.name}</span>
                <span className="mono">{s.note}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {chapter.pending ? <Pending>conteúdo do capítulo</Pending> : null}
        {isLast ? (
          link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="story-cta"
              onClick={() => {
                haptic();
                track("whatsapp_click", { from: "stories", chapter: chapter.id });
              }}
            >
              <WhatsAppGlyph className="h-5 w-5" />
              {chapter.ctaLabel}
            </a>
          ) : (
            <button
              type="button"
              className="story-cta"
              onClick={() => {
                haptic();
                emitPrefill({ id: chapter.id, label: chapter.label, message: chapter.serviceForMessage });
                onCta?.();
                window.setTimeout(() => scrollToHash("#reservar"), 80);
              }}
            >
              <WhatsAppGlyph className="h-5 w-5" />
              {chapter.ctaLabel}
            </button>
          )
        ) : null}
      </div>
    </>
  );
}
