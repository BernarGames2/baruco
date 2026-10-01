import { site } from "@/content/site";

/** Selo "A CONFIRMAR" — some quando `site.showPending` = false. */
export function Pending({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (!site.showPending) return null;
  return (
    <span className={`pending ${className}`}>
      <span>A confirmar · {children}</span>
    </span>
  );
}
