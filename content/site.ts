/**
 * CONTEÚDO ÚNICO DO SITE — Baruco Schiavinato Cabeleireiros
 * ---------------------------------------------------------
 * Todo texto, link, horário, serviço e placeholder vive aqui.
 * Regra: NADA inventado. O que não foi confirmado pelo salão usa `PENDING`
 * ("A CONFIRMAR") e tem um comentário TODO explicando o que falta.
 * Lista consolidada de pendências: /docs/A-CONFIRMAR.md
 */

export const PENDING = "A CONFIRMAR" as const;

/** Uma "vaga" de imagem/vídeo. Sem `src` → placeholder noite/ouro com rótulo "FOTO A CONFIRMAR". */
export type MediaSlot = {
  /** Caminho em /public (AVIF/WebP). Vazio enquanto o salão não enviar o material autorizado. */
  src?: string;
  /** Para vídeo vertical curto (<2MB, loop mudo). */
  video?: string;
  poster?: string;
  alt: string;
  /** ID da cena na /docs/SHOT-LIST.md */
  shot: string;
  /** O que a foto deve mostrar (aparece no placeholder para orientar o cliente). */
  brief: string;
  /** Pessoas visíveis precisam de autorização de uso de imagem. */
  needsAuthorization: boolean;
};

export type Chapter = {
  id: string;
  /** Nome exatamente como no destaque do Instagram. */
  label: string;
  icon:
    | "mechas"
    | "masculino"
    | "manicure"
    | "coloracao"
    | "horarios"
    | "tratamentos"
    | "curso"
    | "estrela";
  /** O que vai na mensagem do WhatsApp ("quero agendar ___"). */
  serviceForMessage: string;
  ctaLabel: string;
  /** Capítulo cujo conteúdo depende 100% do cliente. */
  pending?: boolean;
  frames: StoryFrame[];
};

export type StoryFrame = {
  kicker: string;
  title: string;
  caption: string;
  media: MediaSlot;
  /** Serviços reais (sem preço). */
  services?: { name: string; note: string }[];
  /** Mostra os horários ao vivo dentro do story. */
  showHours?: boolean;
};

export const site = {
  name: "Baruco Schiavinato Cabeleireiros",
  shortName: "Baruco Schiavinato",
  monogram: "BS",
  tagline: "Seu momento é aqui!",
  /** Linha de apoio do hero — dados confirmados (bio + endereço). */
  supportLine: "Salão feminino e masculino · Centro · Uberlândia",
  bio: "Salão feminino e masculino · corte, cor, hidratação e mais",

  /**
   * Mostra os selos "A CONFIRMAR" na interface.
   * TODO: mudar para `false` quando todo o conteúdo pendente for entregue.
   */
  showPending: true,

  seo: {
    title: "Baruco Schiavinato Cabeleireiros | Salão em Uberlândia – Centro",
    description:
      "Salão feminino e masculino no Centro de Uberlândia: corte, coloração, mechas, hidratação, tratamentos e manicure. Terça a sábado, 9h30–19h30. Agende pelo WhatsApp.",
    /** TODO A CONFIRMAR: domínio oficial. Definir NEXT_PUBLIC_SITE_URL no build. */
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    locale: "pt_BR",
  },

  contact: {
    phoneDisplay: "(34) 3255-4838",
    phoneHref: "tel:+553432554838",
    phoneE164: "+55-34-3255-4838",
    /**
     * TODO A CONFIRMAR: número oficial do WhatsApp de agendamento (link "Agendamentos WhatsApp" na bio).
     * Formato: só dígitos com DDI+DDD, ex. "5534999999999". Enquanto `null`, o site
     * direciona para o fluxo de reserva e oferece o telefone fixo.
     */
    whatsappNumber: null as string | null,
  },

  address: {
    street: "Rua Professor Pedro Bernardo, 184",
    district: "Centro",
    city: "Uberlândia",
    state: "MG",
    postalCode: "38400-172",
    country: "BR",
    oneLine: "Rua Professor Pedro Bernardo, 184 – Centro – Uberlândia/MG – CEP 38400-172",
    mapsQuery: "Baruco Schiavinato Cabeleireiros, Rua Professor Pedro Bernardo, 184, Centro, Uberlândia - MG, 38400-172",
  },

  instagram: {
    handle: "@barucoschiavinato",
    url: "https://www.instagram.com/barucoschiavinato/",
    category: "Salão de Cabeleireiros – Uberlândia – conteúdo viral",
    /** Contadores reais do perfil — atualizar aqui. */
    followers: { value: 19200, display: "19,2 mil", label: "seguidores" },
    posts: { value: 5957, display: "5.957", label: "publicações" },
    referenceDate: "out/2026",
    /**
     * TODO A CONFIRMAR: URLs de posts/reels autorizados para o mural (embed oficial do Instagram).
     * Ex.: "https://www.instagram.com/p/XXXXXXXX/". Vazio → mural com placeholders.
     */
    embedPosts: [] as string[],
  },

  /**
   * Horário (fonte: Google). TODO A CONFIRMAR com o salão.
   * day: 0 = domingo … 6 = sábado. Horas no fuso America/Sao_Paulo.
   */
  timezone: "America/Sao_Paulo",
  hours: [
    { day: 0, label: "Domingo", short: "Dom", open: null, close: null },
    { day: 1, label: "Segunda", short: "Seg", open: null, close: null },
    { day: 2, label: "Terça", short: "Ter", open: "09:30", close: "19:30" },
    { day: 3, label: "Quarta", short: "Qua", open: "09:30", close: "19:30" },
    { day: 4, label: "Quinta", short: "Qui", open: "09:30", close: "19:30" },
    { day: 5, label: "Sexta", short: "Sex", open: "09:30", close: "19:30" },
    { day: 6, label: "Sábado", short: "Sáb", open: "09:30", close: "19:30" },
  ] as { day: number; label: string; short: string; open: string | null; close: string | null }[],
  hoursSummary: { open: "Terça a sábado · 9h30–19h30", closed: "Domingo e segunda · fechado" },

  /** Períodos do fluxo de reserva (dentro do horário de funcionamento). */
  periods: [
    { id: "manha", label: "Manhã", range: "9h30–12h" },
    { id: "tarde", label: "Tarde", range: "12h–19h30" },
  ],

  marquee: ["Corte", "Cor", "Mechas", "Hidratação", "Manicure", "Masculino"],

  /** Ato II — textos curtos sem inventar história. */
  mirror: {
    lines: ["Senta.", "A gente cuida do resto."],
    paragraph:
      "Corte, cor, hidratação e mais — para ele e para ela, no Centro de Uberlândia. Você chega como está — e sai com luz própria.",
    /** TODO A CONFIRMAR: história do Baruco (fundação, trajetória, equipe). Não escrever sem o cliente. */
    story: null as string | null,
    media: [
      {
        alt: "Cliente diante do espelho de aro dourado com lâmpadas acesas",
        shot: "S04",
        brief: "Reação da cliente ao se ver no espelho",
        needsAuthorization: true,
      },
      {
        alt: "Detalhe do espelho de aro dourado do salão",
        shot: "S02",
        brief: "Close do espelho com lâmpadas",
        needsAuthorization: false,
      },
      {
        alt: "Mãos de profissional finalizando ondas longas",
        shot: "S06",
        brief: "Mãos com tesoura / pente em câmera lenta",
        needsAuthorization: true,
      },
    ] as MediaSlot[],
  },

  hero: {
    media: {
      alt: "Ondas loiras longas em movimento sob luz de contraluz dourada",
      shot: "V01",
      brief: "Vídeo vertical: ondas em movimento com contraluz",
      needsAuthorization: true,
    } as MediaSlot,
  },

  /** Equipe — TODO A CONFIRMAR: nomes e funções. Não exibido até confirmação. */
  team: [] as { name: string; role: string }[],

  /** Marca vista em foto de evento. TODO A CONFIRMAR: só exibir com autorização/contexto. */
  classBeautyClass: { confirmed: false },

  /** Analytics desligado por padrão (LGPD). Para ativar: definir provider + id e o banner de cookies aparece. */
  analytics: { enabled: false, provider: null as null | "ga4" | "plausible", id: "" },
};

/* ------------------------------------------------------------------ */
/* ATO III — CAPÍTULOS (= destaques do Instagram, na ordem do perfil)  */
/* ------------------------------------------------------------------ */

const consult = "valores: consulte";

export const chapters: Chapter[] = [
  {
    id: "mechas",
    label: "Mechas",
    icon: "mechas",
    serviceForMessage: "mechas",
    ctaLabel: "Agendar Mechas",
    frames: [
      {
        kicker: "Capítulo 01",
        title: "Mechas",
        caption: "Luz no lugar certo.",
        media: { alt: "Mechas loiras iluminadas", shot: "S01", brief: "Loiro iluminado com ondas longas", needsAuthorization: true },
      },
      {
        kicker: "Em cena",
        title: "Brilho que aparece na foto",
        caption: "Cada loiro começa diante do espelho.",
        media: { alt: "Processo de mechas no salão", shot: "S07", brief: "Processo: papel/pincel aplicando mechas", needsAuthorization: true },
      },
      {
        kicker: "No roteiro",
        title: "Serviço",
        caption: "Técnicas de mechas oferecidas: A CONFIRMAR com o salão.",
        services: [{ name: "Mechas", note: consult }],
        media: { alt: "Resultado final de mechas", shot: "S08", brief: "Resultado final de mechas, luz natural", needsAuthorization: true },
      },
    ],
  },
  {
    id: "masculino",
    label: "Masculino",
    icon: "masculino",
    serviceForMessage: "um atendimento masculino",
    ctaLabel: "Agendar Masculino",
    frames: [
      {
        kicker: "Capítulo 02",
        title: "Masculino",
        caption: "Salão feminino e masculino. Ele também entra em cena.",
        media: { alt: "Corte masculino", shot: "S09", brief: "Corte masculino finalizado, perfil", needsAuthorization: true },
      },
      {
        kicker: "Em cena",
        title: "Acabamento",
        caption: "Detalhe é o que faz o look.",
        media: { alt: "Detalhe de acabamento masculino", shot: "S10", brief: "Close de acabamento com navalha/máquina", needsAuthorization: true },
      },
      {
        kicker: "No roteiro",
        title: "Serviço",
        caption: "Lista de serviços masculinos: A CONFIRMAR com o salão.",
        services: [{ name: "Corte masculino", note: consult }],
        media: { alt: "Cliente masculino no espelho", shot: "S11", brief: "Cliente masculino diante do espelho", needsAuthorization: true },
      },
    ],
  },
  {
    id: "manicure",
    label: "Manicure",
    icon: "manicure",
    serviceForMessage: "manicure",
    ctaLabel: "Agendar Manicure",
    frames: [
      {
        kicker: "Capítulo 03",
        title: "Manicure",
        caption: "A produção vai até a ponta dos dedos.",
        media: { alt: "Mãos com esmaltação", shot: "S12", brief: "Mãos com esmalte, fundo mármore", needsAuthorization: true },
      },
      {
        kicker: "No roteiro",
        title: "Serviço",
        caption: "Demais serviços de unhas: A CONFIRMAR com o salão.",
        services: [{ name: "Manicure", note: consult }],
        media: { alt: "Mesa de manicure", shot: "S13", brief: "Mesa de manicure com esmaltes", needsAuthorization: false },
      },
    ],
  },
  {
    id: "coloracao",
    label: "Coloração",
    icon: "coloracao",
    serviceForMessage: "coloração",
    ctaLabel: "Agendar Coloração",
    frames: [
      {
        kicker: "Capítulo 04",
        title: "Coloração",
        caption: "Cor é personagem.",
        media: { alt: "Cabelo recém-colorido com brilho", shot: "S14", brief: "Cor finalizada com brilho, contraluz", needsAuthorization: true },
      },
      {
        kicker: "Em cena",
        title: "Pincel na mão",
        caption: "Do pincel ao último fio.",
        media: { alt: "Pincel de coloração em ação", shot: "S15", brief: "Pincel e cumbuca de coloração", needsAuthorization: false },
      },
      {
        kicker: "No roteiro",
        title: "Serviço",
        caption: "Técnicas de coloração: A CONFIRMAR com o salão.",
        services: [{ name: "Coloração", note: consult }],
        media: { alt: "Resultado de coloração", shot: "S16", brief: "Resultado de coloração, antes de sair", needsAuthorization: true },
      },
    ],
  },
  {
    id: "horarios",
    label: "Horários",
    icon: "horarios",
    serviceForMessage: "um horário",
    ctaLabel: "Agendar meu horário",
    frames: [
      {
        kicker: "Capítulo 05",
        title: "Horários",
        caption: "Terça a sábado, das 9h30 às 19h30.",
        showHours: true,
        media: { alt: "Fachada ou recepção do salão", shot: "S17", brief: "Fachada / recepção do salão", needsAuthorization: false },
      },
      {
        kicker: "Coxia",
        title: "Domingo e segunda",
        caption: "Fechado. O camarim descansa para a próxima sessão.",
        media: { alt: "Salão com luzes apagadas", shot: "S18", brief: "Salão vazio, luzes baixas", needsAuthorization: false },
      },
    ],
  },
  {
    id: "tratamentos",
    label: "Tratamentos",
    icon: "tratamentos",
    serviceForMessage: "hidratação / tratamento",
    ctaLabel: "Agendar Tratamento",
    frames: [
      {
        kicker: "Capítulo 06",
        title: "Tratamentos",
        caption: "Brilho de verdade começa no cuidado.",
        media: { alt: "Fios hidratados com brilho", shot: "S19", brief: "Fios hidratados, macro com brilho", needsAuthorization: true },
      },
      {
        kicker: "No roteiro",
        title: "Serviços",
        caption: "Outros tratamentos e marcas usadas: A CONFIRMAR com o salão.",
        services: [{ name: "Hidratação", note: consult }],
        media: { alt: "Borrifador em câmera lenta", shot: "S20", brief: "Borrifador/pente em câmera lenta", needsAuthorization: false },
      },
    ],
  },
  {
    id: "curso-lotufo",
    label: "Curso Lotufo",
    icon: "curso",
    serviceForMessage: "informações sobre o Curso Lotufo",
    ctaLabel: "Perguntar sobre o Curso Lotufo",
    pending: true,
    frames: [
      {
        kicker: "Capítulo 07",
        title: "Curso Lotufo",
        // TODO A CONFIRMAR: o que é o Curso Lotufo, datas, público. Conteúdo vem do cliente.
        caption: "Conteúdo deste capítulo: A CONFIRMAR com o salão.",
        media: { alt: "Imagem do Curso Lotufo", shot: "S21", brief: "Material do Curso Lotufo (enviado pelo salão)", needsAuthorization: true },
      },
    ],
  },
  {
    id: "romeu-felipe",
    label: "Romeu Felipe",
    icon: "estrela",
    serviceForMessage: "informações sobre Romeu Felipe",
    ctaLabel: "Falar sobre Romeu Felipe",
    pending: true,
    frames: [
      {
        kicker: "Capítulo 08",
        title: "Romeu Felipe",
        // TODO A CONFIRMAR: quem/o que é "Romeu Felipe" no contexto do salão. Não presumir.
        caption: "Conteúdo deste capítulo: A CONFIRMAR com o salão.",
        media: { alt: "Imagem do destaque Romeu Felipe", shot: "S22", brief: "Material do destaque Romeu Felipe (enviado pelo salão)", needsAuthorization: true },
      },
    ],
  },
];

/** Serviços para o fluxo de reserva (somente os confirmados pela bio/destaques). */
export const bookingServices = [
  { id: "corte", label: "Corte", message: "corte" },
  { id: "coloracao", label: "Coloração", message: "coloração" },
  { id: "mechas", label: "Mechas", message: "mechas" },
  { id: "hidratacao", label: "Hidratação", message: "hidratação" },
  { id: "tratamentos", label: "Tratamentos", message: "tratamento" },
  { id: "manicure", label: "Manicure", message: "manicure" },
  { id: "masculino", label: "Masculino", message: "atendimento masculino" },
  { id: "outro", label: "Outro / não sei", message: "um horário (quero orientação)" },
];

/* ------------------------------------------------------------------ */
/* ATO IV — PASSARELA (12 looks). Só publicar com autorização.          */
/* ------------------------------------------------------------------ */

export type Look = {
  media: MediaSlot;
  /** TODO A CONFIRMAR: nome da técnica — só exibir se o salão confirmar. */
  technique: string | null;
};

export const looks: Look[] = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const briefs = [
    "Loiro iluminado, ondas longas",
    "Produção de noiva (penteado)",
    "Makeup + penteado de evento",
    "Corte masculino",
    "Coloração com brilho",
    "Ondas longas em movimento",
    "Mechas, vista de costas",
    "Penteado preso de festa",
    "Corte curto feminino",
    "Tratamento: antes de sair",
    "Loiro + escova",
    "Resultado com a equipe",
  ];
  return {
    technique: null,
    media: {
      alt: `Look ${n} do salão — imagem a confirmar`,
      shot: `L${n}`,
      brief: briefs[i],
      needsAuthorization: true,
    },
  };
});

/** Antes/depois — TODO A CONFIRMAR: somente pares reais autorizados. */
export const compare = {
  before: { alt: "Antes", shot: "AD1-A", brief: "ANTES — mesma luz e ângulo do depois", needsAuthorization: true } as MediaSlot,
  after: { alt: "Depois", shot: "AD1-B", brief: "DEPOIS — mesma luz e ângulo do antes", needsAuthorization: true } as MediaSlot,
  technique: null as string | null,
};

/** Mural de bastidores (enquanto não houver embeds autorizados). */
export const backstageMural: MediaSlot[] = [
  { alt: "Bastidores do salão 1", shot: "B01", brief: "Equipe rindo no camarim", needsAuthorization: true },
  { alt: "Bastidores do salão 2", shot: "B02", brief: "Capim-dos-pampas + mármore", needsAuthorization: false },
  { alt: "Bastidores do salão 3", shot: "B03", brief: "Gravação de reel no salão", needsAuthorization: true },
  { alt: "Bastidores do salão 4", shot: "B04", brief: "Bancada com produtos", needsAuthorization: false },
  { alt: "Bastidores do salão 5", shot: "B05", brief: "Cliente saindo produzida", needsAuthorization: true },
];

/* ------------------------------------------------------------------ */
/* ATOS — usados pelo Roteiro (navegação) e pelo fio dourado.           */
/* ------------------------------------------------------------------ */

export const acts = [
  { id: "ato-1", numeral: "I", title: "Entrada em cena", short: "Entrada" },
  { id: "ato-2", numeral: "II", title: "O Espelho", short: "Espelho" },
  { id: "ato-3", numeral: "III", title: "Os Capítulos", short: "Capítulos" },
  { id: "ato-4", numeral: "IV", title: "A Passarela", short: "Passarela" },
  { id: "ato-5", numeral: "V", title: "Os Bastidores", short: "Bastidores" },
  { id: "ato-6", numeral: "VI", title: "Camarim Reservado", short: "Reserva" },
] as const;
