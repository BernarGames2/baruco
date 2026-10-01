import Image from "next/image";
import type { MediaSlot } from "@/content/site";

type Props = {
  slot: MediaSlot;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Esconde a descrição do placeholder (molduras pequenas). */
  compact?: boolean;
  /** Oculta todo o rótulo (uso decorativo repetido). */
  bare?: boolean;
};

/**
 * Foto/vídeo real do salão, ou placeholder noite/ouro "FOTO A CONFIRMAR".
 * Nunca usar banco de imagem fingindo ser o salão.
 */
export function Media({ slot, sizes = "100vw", priority, className = "", compact, bare }: Props) {
  if (slot.video) {
    return (
      <div className={`media-tone absolute inset-0 overflow-hidden ${className}`}>
        <video
          className="h-full w-full object-cover"
          src={slot.video}
          poster={slot.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-label={slot.alt}
        />
      </div>
    );
  }
  if (slot.src) {
    return (
      <div className={`media-tone absolute inset-0 overflow-hidden ${className}`}>
        <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`ph ${className}`} role="img" aria-label={`${slot.alt} (foto a confirmar)`}>
      {bare ? null : (
        <span className="ph-label mono" aria-hidden="true">
          <span className="ph-tag">{compact ? `${slot.shot} · foto a confirmar` : `Foto a confirmar · ${slot.shot}`}</span>
          {compact ? null : <span className="ph-brief">{slot.brief}</span>}
        </span>
      )}
    </div>
  );
}
