/**
 * Horário de funcionamento calculado no fuso do salão (America/Sao_Paulo),
 * independente do fuso do aparelho de quem visita.
 */

export type DayHours = { day: number; label: string; short: string; open: string | null; close: string | null };

export type OpenStatus = {
  isOpen: boolean;
  /** Texto curto, ex.: "fecha às 19h30" / "abre terça às 9h30". */
  detail: string;
  /** Dia da semana atual no fuso do salão (0 = domingo). */
  today: number;
};

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Dia da semana + minutos desde 00:00 no fuso informado. */
export function zonedNow(date: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = WEEKDAYS[get("weekday")] ?? 0;
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { day, minutes };
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** "09:30" → "9h30", "19:00" → "19h" */
export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

export function getOpenStatus(hours: DayHours[], date: Date, timeZone: string): OpenStatus {
  const { day, minutes } = zonedNow(date, timeZone);
  const todayH = hours.find((h) => h.day === day);

  if (todayH?.open && todayH.close) {
    const o = toMinutes(todayH.open);
    const c = toMinutes(todayH.close);
    if (minutes >= o && minutes < c) {
      return { isOpen: true, detail: `fecha às ${formatHour(todayH.close)}`, today: day };
    }
    if (minutes < o) {
      return { isOpen: false, detail: `abre hoje às ${formatHour(todayH.open)}`, today: day };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = hours.find((x) => x.day === d);
    if (h?.open) {
      const when = i === 1 ? "amanhã" : h.label.toLowerCase();
      return { isOpen: false, detail: `abre ${when} às ${formatHour(h.open)}`, today: day };
    }
  }
  return { isOpen: false, detail: "", today: day };
}

/** Próximos `count` dias de funcionamento (a partir de amanhã se hoje já fechou). */
export function nextOpenDays(
  hours: DayHours[],
  date: Date,
  timeZone: string,
  count: number,
): { date: Date; label: string; short: string; dayMonth: string }[] {
  const out: { date: Date; label: string; short: string; dayMonth: string }[] = [];
  const { day, minutes } = zonedNow(date, timeZone);
  const fmt = new Intl.DateTimeFormat("pt-BR", { timeZone, day: "2-digit", month: "2-digit" });
  for (let i = 0; i < 21 && out.length < count; i++) {
    const d = (day + i) % 7;
    const h = hours.find((x) => x.day === d);
    if (!h?.open || !h.close) continue;
    if (i === 0 && minutes >= toMinutes(h.close) - 60) continue; // hoje já está no fim do expediente
    const target = new Date(date.getTime() + i * 86_400_000);
    out.push({ date: target, label: h.label, short: h.short, dayMonth: fmt.format(target) });
  }
  return out;
}
