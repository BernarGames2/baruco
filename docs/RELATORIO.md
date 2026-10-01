# Relatório de entrega — O Camarim

**Branch:** `claude/ecstatic-faraday-238x0h` · Next.js 16 (App Router, export estático em `out/`) + TypeScript + Tailwind 4 + GSAP (ScrollTrigger/Flip) + Lenis + OGL.

## Como rodar
```bash
npm install
npm run dev            # desenvolvimento
npm run build          # gera out/ (site estático)
npm test               # testes do horário/fuso
NEXT_PUBLIC_SITE_URL=https://dominio npm run build   # quando houver domínio
```

## O que foi entregue (por Ato)
- **Preloader "Cortinas"**: veludo, contador 000→100, monograma desenhado em ouro, cortinas abrem; pulado em visita repetida (sessionStorage) e com movimento reduzido; failsafe se o JS falhar.
- **Ato I + II (palco pinado)**: título letra a letra, anel "storie", fita em S em WebGL (OGL, lazy, reage a mouse/giroscópio/rolagem, pausa fora da tela, fallback SVG); o círculo se expande e vira o fundo do **Espelho**, cujas lâmpadas acendem em onda e o texto surge "refletido".
- **Ato III — Capítulos**: os 8 destaques reais; visualizador Stories fullscreen (barras, toque nas bordas, swipe, setas, ←/→/Esc/Espaço, 6 s com pausa ao segurar, wipe radial, CTA "Agendar [capítulo]"); fallback `<noscript>`.
- **Ato IV — Passarela**: 12 reels 9:16 pinados com parallax, tilt 3D, contador 01/12 e luzes de passarela; carrossel por swipe no mobile; antes/depois com puxador-tesoura (acessível por teclado).
- **Ato V — Bastidores**: letreiro "em cartaz" com contadores reais, comunidade (link pendente), mural de camarim; embeds do Instagram só com clique.
- **Ato VI — Camarim Reservado**: fluxo de 3 cenas → mensagem wa.me pré-preenchida; confirmação com cortina + estrela + vibração; ficha de camarim com ABERTO/FECHADO em America/Sao_Paulo; mapa por clique, "Como chegar", telefone.
- **Assinaturas**: fio dourado fixo que costura os Atos, cortinas de 0,5 s nas claquetes, holofote/tesoura no cursor, botões magnéticos com lâmpadas, navegação "Roteiro" em vez de menu, 404 "Essa cena foi cortada".
- **SEO**: title/description pedidos, JSON-LD HairSalon (sem aggregateRating), OG 1200×630, robots, sitemap. Analytics desligado (banner LGPD pronto em `ConsentBanner`).

## Verificação
- `tsc` sem erros; build estático OK; 7 testes de horário/fuso passando.
- Playwright (Chromium) desktop 1440×900, mobile 375×812 e `prefers-reduced-motion`: fluxo completo (stories, passarela, reserva, roteiro) **sem erros de console**.
- Screenshots: `docs/screenshots/desktop-*.png` e `mobile-*.png` (`npm run screenshots` regenera).
- **Lighthouse não foi medido** neste ambiente (sem GPU/rede para a ferramenta). Medidas tomadas para a meta: WebGL e mapa/Instagram carregados sob demanda, fontes via next/font, sem imagens pesadas, export estático. Rodar Lighthouse mobile antes de publicar — o preloader e a revelação do título podem pesar no LCP.

## Pendências
Ver `docs/A-CONFIRMAR.md` (dados + autorizações) e `docs/SHOT-LIST.md` (ensaio).
