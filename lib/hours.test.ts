import { test } from "node:test";
import assert from "node:assert/strict";
import { getOpenStatus, nextOpenDays, zonedNow, type DayHours } from "./hours.ts";

const HOURS: DayHours[] = [
  { day: 0, label: "Domingo", short: "Dom", open: null, close: null },
  { day: 1, label: "Segunda", short: "Seg", open: null, close: null },
  { day: 2, label: "Terça", short: "Ter", open: "09:30", close: "19:30" },
  { day: 3, label: "Quarta", short: "Qua", open: "09:30", close: "19:30" },
  { day: 4, label: "Quinta", short: "Qui", open: "09:30", close: "19:30" },
  { day: 5, label: "Sexta", short: "Sex", open: "09:30", close: "19:30" },
  { day: 6, label: "Sábado", short: "Sáb", open: "09:30", close: "19:30" },
];
const TZ = "America/Sao_Paulo";

// São Paulo é UTC-3 (sem horário de verão desde 2019).
test("terça 10h em SP → aberto", () => {
  const s = getOpenStatus(HOURS, new Date("2026-10-06T13:00:00Z"), TZ);
  assert.equal(s.isOpen, true);
  assert.equal(s.detail, "fecha às 19h30");
});

test("terça 9h29 em SP → fechado, abre hoje", () => {
  const s = getOpenStatus(HOURS, new Date("2026-10-06T12:29:00Z"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.detail, "abre hoje às 9h30");
});

test("sábado 19h30 em SP → fechado, abre terça", () => {
  const s = getOpenStatus(HOURS, new Date("2026-10-10T22:30:00Z"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.detail, "abre terça às 9h30");
});

test("segunda → fechado, abre amanhã", () => {
  const s = getOpenStatus(HOURS, new Date("2026-10-05T15:00:00Z"), TZ);
  assert.equal(s.isOpen, false);
  assert.equal(s.detail, "abre amanhã às 9h30");
});

test("usa o fuso do salão, não o UTC: sábado 23h UTC = 20h em SP (fechado)", () => {
  const d = new Date("2026-10-10T23:00:00Z");
  assert.deepEqual(zonedNow(d, TZ), { day: 6, minutes: 20 * 60 });
  assert.equal(getOpenStatus(HOURS, d, TZ).isOpen, false);
});

test("domingo 01h UTC = sábado 22h em SP", () => {
  assert.equal(zonedNow(new Date("2026-10-11T01:00:00Z"), TZ).day, 6);
});

test("próximos dias pulam domingo e segunda", () => {
  const days = nextOpenDays(HOURS, new Date("2026-10-10T20:00:00Z"), TZ, 3); // sábado 17h
  assert.deepEqual(days.map((d) => d.short), ["Sáb", "Ter", "Qua"]);
  assert.equal(days[1].dayMonth, "13/10");
});
