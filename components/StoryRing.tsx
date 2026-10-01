import type { CSSProperties, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  spin?: boolean;
  ringWidth?: number;
  style?: CSSProperties;
};

/** Anel dourado estilo "destaque do Instagram". */
export function StoryRing({ children, className = "", spin = true, ringWidth = 3, style }: Props) {
  return (
    <div
      className={`story-ring ${className}`}
      data-spin={spin}
      style={{ ["--ring-w" as string]: `${ringWidth}px`, ...style }}
    >
      <span className="ring-gold" aria-hidden="true" />
      <div className="absolute rounded-full overflow-hidden" style={{ inset: ringWidth + 4 }}>
        {children}
      </div>
    </div>
  );
}
