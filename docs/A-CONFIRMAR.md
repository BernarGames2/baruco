# Pendências — A CONFIRMAR / autorizações

Tudo abaixo está marcado no site com o selo "A CONFIRMAR" e centralizado em `content/site.ts` (comentários `TODO`). Para esconder os selos depois de tudo entregue: `site.showPending = false`.

## Dados do salão
1. **Número oficial do WhatsApp** de agendamento → `site.contact.whatsappNumber` (hoje `null`: os botões levam ao fluxo de reserva, que gera a mensagem e oferece copiar/ligar no fixo).
3. **Logo vetorial (SVG/PDF)** do monograma BS — o monograma atual é uma interpretação provisória (`components/Monogram.tsx`, `app/icon.svg`, `public/og.png`).
4. **Lista de serviços** e se divulga preços (hoje só os confirmados pela bio/destaques, todos "valores: consulte").
5. **O que são "Curso Lotufo" e "Romeu Felipe"** — capítulos com conteúdo 100% pendente.
6. **História do Baruco** (Ato II) — nada foi escrito sobre fundação/trajetória.
7. **Nomes e funções da equipe** (não exibidos).
8. **Domínio oficial** → variável `NEXT_PUBLIC_SITE_URL` no build (canonical, OG, JSON-LD, sitemap).
9. **Horários** (fonte Google: Ter–Sáb 9h30–19h30, Dom/Seg fechado).
10. **Class Beauty Class / marcas** — fora do site até confirmação (`site.classBeautyClass.confirmed`).
11. **Nomes de técnicas** sobre os looks (`looks[].technique`) e antes/depois.
12. **URLs de posts/reels** autorizados para o mural (`site.instagram.embedPosts`; carregam só com clique — LGPD).
13. Contadores do Instagram (19,2 mil / 5.957, out/2026) — atualizar em `site.instagram`.

## Imagens que precisam de autorização de uso
Todas as vagas com `needsAuthorization: true` em `content/site.ts`: V01, S01, S04, S06–S12, S14, S16, S19, S21, S22, L01–L12, AD1-A/B, B01, B03, B05. Nenhuma imagem do Instagram foi copiada ou hotlinkada; nenhum banco de imagem foi usado.
