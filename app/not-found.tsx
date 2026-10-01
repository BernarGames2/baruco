import type { Metadata } from "next";
import Link from "next/link";
import { ScissorsIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Essa cena foi cortada | Baruco Schiavinato Cabeleireiros",
  robots: { index: false },
};

/** 404 temática: o filme foi cortado na tesoura. */
export default function NotFound() {
  return (
    <main className="cut">
      <div className="cut-film" aria-hidden="true">
        <div className="cut-strip cut-strip-a">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="cut-frame" />
          ))}
        </div>
        <ScissorsIcon className="cut-scissors" open={0.8} />
        <div className="cut-strip cut-strip-b">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="cut-frame" />
          ))}
        </div>
      </div>
      <p className="mono cut-code">Erro 404 · cena inexistente</p>
      <h1 className="display cut-title">
        Essa cena foi <em className="metal-text">cortada</em>.
      </h1>
      <p className="cut-text">A página que você procurou ficou na sala de edição.</p>
      <Link href="/" className="mag mag-gold mag-lg">
        <span className="mag-label">Voltar para o camarim</span>
      </Link>
    </main>
  );
}
