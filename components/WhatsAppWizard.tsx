"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { bookingServices, site } from "@/content/site";
import { nextOpenDays } from "@/lib/hours";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { onPrefill } from "@/lib/bus";
import { haptic, track } from "@/lib/analytics";
import { Curtain } from "@/components/Curtain";
import { StarIcon, WhatsAppGlyph } from "@/components/Icons";
import { Pending } from "@/components/Pending";

type Choice = { id: string; label: string; message: string };
type DayOpt = { id: string; label: string; sub: string; phrase: string };

const STEPS = ["Serviço", "Quando", "Seu nome"];

/** Dias padrão (sem data) para o HTML estático; no navegador viram as próximas datas reais. */
const fallbackDays: DayOpt[] = site.hours
  .filter((h) => h.open)
  .map((h) => ({ id: `d${h.day}`, label: h.short, sub: h.label, phrase: `uma ${h.label.toLowerCase()}` }));

/**
 * Mini-fluxo de reserva sem backend: (1) serviço, (2) dia + período, (3) nome
 * → mensagem pronta no WhatsApp. Confirmação: a cortina fecha e uma estrela pulsa.
 */
export function WhatsAppWizard() {
  const [step, setStep] = useState(0);
  const [custom, setCustom] = useState<Choice | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [days, setDays] = useState<DayOpt[]>(fallbackDays);
  const [day, setDay] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [done, setDone] = useState<{ message: string; link: string | null } | null>(null);
  const [copied, setCopied] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const services: Choice[] = useMemo(() => (custom ? [custom, ...bookingServices] : bookingServices), [custom]);

  useEffect(() => {
    const next = nextOpenDays(site.hours, new Date(), site.timezone, 5).map((d) => ({
      id: d.date.toISOString().slice(0, 10),
      label: `${d.short} ${d.dayMonth}`,
      sub: d.label,
      phrase: `${d.dayMonth} (${d.label.toLowerCase()})`,
    }));
    if (next.length) setDays(next);
  }, []);

  useEffect(
    () =>
      onPrefill((d) => {
        const known = bookingServices.find((s) => s.id === d.id);
        if (known) setService(known.id);
        else {
          setCustom(d);
          setService(d.id);
        }
        setDone(null);
        setStep(1);
      }),
    [],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus({ preventScroll: true });
  }, [step]);

  const chosenService = services.find((s) => s.id === service);
  const chosenDay = days.find((d) => d.id === day);
  const chosenPeriod = site.periods.find((p) => p.id === period);
  const when =
    chosenDay && chosenPeriod
      ? `${chosenDay.phrase}, ${chosenPeriod.id === "manha" ? "de manhã" : "à tarde"}`
      : undefined;
  const message = bookingMessage({ service: chosenService?.message, when, name });
  const canNext = step === 0 ? Boolean(service) : step === 1 ? Boolean(day && period) : name.trim().length >= 2;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (canNext) setStep(step + 1);
      return;
    }
    if (!canNext) return;
    const link = whatsappLink(message);
    haptic(30);
    track("wizard_submit", { service: service ?? "" });
    if (link) window.open(link, "_blank", "noopener,noreferrer");
    setDone({ message, link });
  };

  const reset = () => {
    setDone(null);
    setStep(0);
    setService(null);
    setDay(null);
    setPeriod(null);
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(done?.message ?? message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="wizard">
      <form className="wizard-form" onSubmit={submit} aria-describedby="wizard-status" inert={done ? true : undefined}>
        <div className="wizard-steps" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={`wizard-step ${i <= step ? "is-on" : ""}`}>
              <span className={`bulb ${i <= step ? "is-on" : ""}`} />
              <span className="mono">
                Cena {i + 1} · {s}
              </span>
            </span>
          ))}
        </div>
        <p id="wizard-status" className="sr-only" aria-live="polite">
          Cena {step + 1} de 3: {STEPS[step]}
        </p>

        <div ref={stepRef} tabIndex={-1} className="wizard-body">
          {step === 0 ? (
            <fieldset>
              <legend className="display wizard-legend">
                O que vamos <em className="metal-text">fazer</em>?
              </legend>
              <div className="chips">
                {services.map((s) => (
                  <label key={s.id} className="chip">
                    <input
                      type="radio"
                      name="servico"
                      value={s.id}
                      checked={service === s.id}
                      onChange={() => setService(s.id)}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === 1 ? (
            <>
              <fieldset>
                <legend className="display wizard-legend">
                  Que <em className="metal-text">dia</em>?
                </legend>
                <div className="chips">
                  {days.map((d) => (
                    <label key={d.id} className="chip">
                      <input type="radio" name="dia" value={d.id} checked={day === d.id} onChange={() => setDay(d.id)} />
                      <span>
                        {d.label}
                        <span className="sr-only"> ({d.sub})</span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="wizard-note mono">{site.hoursSummary.open} · dom. e seg. fechado</p>
              </fieldset>
              <fieldset>
                <legend className="wizard-sublegend">Período</legend>
                <div className="chips">
                  {site.periods.map((p) => (
                    <label key={p.id} className="chip chip-wide">
                      <input
                        type="radio"
                        name="periodo"
                        value={p.id}
                        checked={period === p.id}
                        onChange={() => setPeriod(p.id)}
                      />
                      <span>
                        {p.label} <span className="mono chip-sub">{p.range}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {step === 2 ? (
            <div className="wizard-name">
              <label htmlFor="wizard-nome" className="display wizard-legend">
                E o seu <em className="metal-text">nome</em>?
              </label>
              <input
                id="wizard-nome"
                className="wizard-input"
                type="text"
                autoComplete="given-name"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como a gente te chama"
                required
              />
              <figure className="wizard-preview">
                <figcaption className="mono">Sua fala no roteiro</figcaption>
                <blockquote>“{message}”</blockquote>
              </figure>
            </div>
          ) : null}
        </div>

        <div className="wizard-actions">
          {step > 0 ? (
            <button type="button" className="wizard-back" onClick={() => setStep(step - 1)}>
              ← Voltar
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="mag mag-gold mag-md wizard-next" disabled={!canNext}>
            <span className="mag-label">
              {step < 2 ? (
                "Próxima cena →"
              ) : (
                <>
                  <WhatsAppGlyph className="h-5 w-5" /> {site.contact.whatsappNumber ? "Abrir no WhatsApp" : "Gerar mensagem"}
                </>
              )}
            </span>
          </button>
        </div>
      </form>

      {/* Confirmação: cortina fecha + estrela pulsa */}
      <Curtain state={done ? "closed" : "open"} duration={0.8} className="wizard-curtain" />
      {done ? (
        <div className="wizard-done" role="status">
          <StarIcon className="wizard-star" id="wizard-star-g" />
          <p className="display wizard-done-title">
            Mensagem <em className="metal-text">pronta</em>.
          </p>
          {done.link ? (
            <>
              <p>O WhatsApp do salão abriu numa nova aba. É só enviar — a confirmação vem pela conversa.</p>
              <a className="mag mag-gold mag-md" href={done.link} target="_blank" rel="noopener noreferrer">
                <span className="mag-label">
                  <WhatsAppGlyph className="h-5 w-5" /> Abrir de novo
                </span>
              </a>
            </>
          ) : (
            <>
              <p>
                O número de WhatsApp do salão ainda está sendo confirmado. Copie a mensagem ou ligue para{" "}
                <a href={site.contact.phoneHref} className="underline decoration-ouro underline-offset-4">
                  {site.contact.phoneDisplay}
                </a>
                .
              </p>
              <Pending>número oficial do WhatsApp</Pending>
              <button type="button" className="mag mag-gold mag-md" onClick={copy}>
                <span className="mag-label">{copied ? "Copiado ✓" : "Copiar mensagem"}</span>
              </button>
            </>
          )}
          <button type="button" className="wizard-back" onClick={reset}>
            Fazer outra reserva
          </button>
        </div>
      ) : null}
    </div>
  );
}
