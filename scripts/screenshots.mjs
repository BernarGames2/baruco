/**
 * Gera screenshots desktop/mobile do build estático.
 * Uso: npm run build && (python3 -m http.server 4173 -d out &) && node scripts/screenshots.mjs [url] [pasta]
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.argv[2] || "http://localhost:4173/";
const OUT = process.argv[3] || "docs/screenshots";
const EXEC = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
fs.mkdirSync(OUT, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(label, ctxOpts, { reduced = false } = {}) {
  const browser = await chromium.launch({ executablePath: EXEC, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const ctx = await browser.newContext({ ...ctxOpts, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const shot = (name) => page.screenshot({ path: `${OUT}/${label}-${name}.png` });

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  if (!reduced) {
    await wait(700);
    await shot("00-preloader");
  }
  await page.waitForLoadState("load");
  await wait(reduced ? 800 : 5200);
  await shot("01-hero");

  const pos = await page.evaluate(() => {
    const vh = window.innerHeight;
    const spacer = document.querySelector(".entrance")?.parentElement;
    const pinned = spacer?.classList.contains("pin-spacer");
    const top = (sel) => {
      const el = document.querySelector(sel);
      return el ? el.getBoundingClientRect().top + window.scrollY : 0;
    };
    const len = pinned ? spacer.offsetHeight - vh : 0;
    return {
      heroMid: pinned ? len * 0.14 : 0,
      mirror: pinned ? len * 0.9 : top("#ato-2"),
      act3: top("#ato-3") + vh * 0.35,
      rail: top(".rail-wrap") - vh * 0.25,
      act4: top("#ato-4"),
      runway: top(".runway") + (document.querySelector(".runway")?.parentElement?.classList.contains("pin-spacer") ? (document.querySelector(".runway").parentElement.offsetHeight - vh) * 0.45 : 0),
      compare: top(".compare") - vh * 0.2,
      act5: top(".billboard") - vh * 0.15,
      mural: top(".backstage-grid") - vh * 0.1,
      act6: top("#reservar") - 90,
      visit: top(".visit-grid") - 90,
      footer: document.documentElement.scrollHeight,
    };
  });

  const go = async (y, ms = 1800) => {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await wait(ms);
  };

  if (!reduced) {
    await go(pos.heroMid);
    await shot("02-hero-expand");
  }
  await go(pos.mirror, 2200);
  await shot("03-espelho");
  await go(pos.act3);
  await go(pos.rail);
  await shot("04-capitulos");

  // Stories
  await page.click(".chapter >> nth=0");
  await wait(1200);
  await shot("05-stories");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await wait(1200);
  await shot("06-stories-cta");
  await page.keyboard.press("Escape");
  await wait(600);

  await go(pos.act4 + 100);
  await go(pos.runway, 2200);
  await shot("07-passarela");
  await go(pos.compare);
  await shot("08-antes-depois");
  await go(pos.act5);
  await shot("09-bastidores");
  await go(pos.mural);
  await shot("10-mural");
  await go(pos.act6);
  await shot("11-reserva");

  // fluxo de reserva
  await page.check("input[name=servico][value=mechas]", { force: true });
  await page.click(".wizard-next");
  await wait(300);
  await page.check("input[name=dia] >> nth=0", { force: true });
  await page.check("input[name=periodo][value=tarde]", { force: true });
  await page.click(".wizard-next");
  await wait(300);
  await page.fill("#wizard-nome", "Ana");
  await wait(200);
  await shot("12-reserva-mensagem");
  await page.click(".wizard-next");
  await wait(1600);
  await shot("13-reserva-confirmada");

  await go(pos.visit);
  await shot("14-visita");
  await go(pos.footer, 1800);
  await shot("15-rodape");

  await page.click(".topbar-script");
  await wait(1400);
  await shot("16-roteiro");

  await browser.close();
  return errors;
}

const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };
const mobile = {
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

const which = process.env.ONLY;
const results = {};
if (!which || which === "desktop") results.desktop = await run("desktop", desktop);
if (!which || which === "mobile") results.mobile = await run("mobile", mobile);
if (!which || which === "reduced") results.reduced = await run("reduzido", desktop, { reduced: true });
console.log(JSON.stringify(results, null, 2));
