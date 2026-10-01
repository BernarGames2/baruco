/** Gera public/og.png (1200x630): monograma + fita dourada sobre noite. Rodar com o build servido em :4173. */
import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(`<html><body style="margin:0;width:1200px;height:630px;background:radial-gradient(70% 90% at 30% 50%,#1c2a55,#0B1226 60%,#060A18);display:flex;align-items:center;gap:60px;padding:0 90px;box-sizing:border-box;font-family:Georgia,serif;color:#F7F2E8">
<img src="http://localhost:4173/icon.svg" style="width:340px;height:340px;filter:drop-shadow(0 0 40px rgba(201,162,75,.35))">
<div><div style="font:14px monospace;letter-spacing:.2em;color:#F0D58A">UBERLÂNDIA · CENTRO</div>
<div style="font-size:64px;line-height:1;margin:18px 0">Baruco Schiavinato<br>Cabeleireiros</div>
<div style="font-size:44px;font-style:italic;color:#F0D58A">Seu momento é aqui.</div></div></body></html>`);
await p.waitForTimeout(500);
await p.screenshot({ path: "public/og.png" });
await b.close();
