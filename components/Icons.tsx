import type { Chapter } from "@/content/site";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Ícones em linha dourada dos capítulos (destaques do Instagram). */
export function ChapterIcon({ name, className = "" }: { name: Chapter["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
      {name === "mechas" && (
        <>
          <path d="M13 6c-3 7 3 12 0 19s3 11 1 17" />
          <path d="M20 6c-3 7 3 12 0 19s3 11 1 17" />
          <path d="M27 6c-3 7 3 12 0 19" />
          <path d="M26.5 17.5l10.5-4.5 4.5 12-10.5 4.5z" />
          <path d="M30 20l5-2" />
        </>
      )}
      {name === "masculino" && (
        <>
          <path d="M24 25L37.5 10.5a3.2 3.2 0 0 1 4.6 4.4L28.6 29.4" />
          <path d="M31 17l4.5-4.8" opacity=".6" />
          <circle cx="25.8" cy="27.6" r="2.2" />
          <path d="M24.3 29.8L11.2 42.9a2.6 2.6 0 0 1-3.7-3.7l13.2-13.1" />
        </>
      )}
      {name === "manicure" && (
        <>
          <rect x="19.5" y="5" width="9" height="12" rx="1.6" />
          <path d="M16.5 17h15l3 6.5V38a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4V23.5z" />
          <path d="M19 27v8" />
        </>
      )}
      {name === "coloracao" && (
        <>
          <path d="M7 29h34c0 7-7.6 12-17 12S7 36 7 29z" />
          <path d="M27 24L41 7" />
          <path d="M21.5 26.5l4-4 3.5 3-4 4z" />
          <path d="M20 29l1.5-2.5" />
        </>
      )}
      {name === "horarios" && (
        <>
          <circle cx="24" cy="25" r="16" />
          <path d="M24 15v10l7 5" />
          <path d="M19 5h10M24 5v4" />
        </>
      )}
      {name === "tratamentos" && (
        <>
          <path d="M20 5h8v6l2.5 2.5V18h-13v-4.5L20 11z" />
          <rect x="14.5" y="18" width="19" height="25" rx="4.5" />
          <path d="M24 25.5c-2.2 3.2-3.3 5-3.3 6.6a3.3 3.3 0 0 0 6.6 0c0-1.6-1.1-3.4-3.3-6.6z" />
        </>
      )}
      {name === "curso" && (
        <>
          <path d="M24 13c-4.5-3-10.5-4-17-3v26c6.5-1 12.5 0 17 3 4.5-3 10.5-4 17-3V10c-6.5-1-12.5 0-17 3z" />
          <path d="M24 13v26" />
        </>
      )}
      {name === "estrela" && (
        <path d="M24 6.5l5 10.8 11.8 1.4-8.7 8 2.4 11.7L24 32.5l-10.5 5.9 2.4-11.7-8.7-8 11.8-1.4z" />
      )}
    </svg>
  );
}

/** Tesoura (cursor sobre looks, antes/depois, 404). Lâminas separadas para animar. */
export function ScissorsIcon({ className = "", open = 0 }: { className?: string; open?: number }) {
  const a = 10 + open * 14;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...common}>
      <g transform={`rotate(${-a / 2} 22 24)`}>
        <circle cx="10" cy="17" r="5" />
        <path d="M14.5 19L42 26" />
      </g>
      <g transform={`rotate(${a / 2} 22 24)`}>
        <circle cx="10" cy="31" r="5" />
        <path d="M14.5 29L42 22" />
      </g>
      <circle cx="22" cy="24" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ className = "", id = "star-g" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 3l6.2 13.4 14.6 1.7-10.8 9.9 3 14.5L24 35.3 11 42.5l3-14.5L3.2 18.1l14.6-1.7z"
        fill={`url(#${id})`}
        stroke="#F0D58A"
        strokeWidth=".8"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0D58A" />
          <stop offset=".55" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8A6A24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.1.82.83-3-.2-.31a8.2 8.2 0 1 1 6.97 3.82zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.57.68 2.18.73 2.97.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

export function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...common} strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
    </svg>
  );
}
