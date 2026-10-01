import { compare } from "@/content/site";
import { ActSlate } from "@/components/ActSlate";
import { RunwayStrip } from "@/components/RunwayStrip";
import { ScissorCompare } from "@/components/ScissorCompare";
import { Pending } from "@/components/Pending";

/** ATO IV — A PASSARELA: prova visual (somente imagens reais autorizadas). */
export function ActRunway() {
  return (
    <section id="ato-4" aria-labelledby="ato-4-title" className="act-runway">
      <div className="act act-runway-intro">
        <ActSlate
          numeral="IV"
          title="A *Passarela*"
          titleId="ato-4-title"
          line="Looks que saíram da cadeira do Baruco, no formato em que nasceram: reels verticais."
        />
      </div>

      <RunwayStrip />

      <div className="act compare-block">
        <div className="compare-head">
          <p className="mono text-ouro">Corte de cena</p>
          <h3 className="display compare-title">
            Antes <em className="metal-text">&amp;</em> depois
          </h3>
          <p className="compare-sub">Arraste a tesoura para cortar entre as duas cenas.</p>
          <Pending>pares reais de antes/depois, com autorização</Pending>
        </div>
        <ScissorCompare before={compare.before} after={compare.after} />
        {compare.technique ? <p className="compare-tech mono">{compare.technique}</p> : null}
      </div>
    </section>
  );
}
