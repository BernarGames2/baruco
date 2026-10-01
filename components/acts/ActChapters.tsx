import { chapters } from "@/content/site";
import { ActSlate } from "@/components/ActSlate";
import { ChapterRail } from "@/components/ChapterRail";
import { BulbRow } from "@/components/BulbRow";

/** ATO III — OS CAPÍTULOS: serviços em modo Stories (= destaques do Instagram). */
export function ActChapters() {
  return (
    <section id="ato-3" aria-labelledby="ato-3-title" className="act act-chapters">
      <ActSlate
        numeral="III"
        title="Os *Capítulos*"
        titleId="ato-3-title"
        line="Os destaques do nosso Instagram, agora em cena. Toque num círculo."
      />
      <ChapterRail />
      <noscript>
        <ul className="rail-fallback">
          {chapters.map((c) => (
            <li key={c.id}>
              <strong>{c.label}</strong>
              {c.frames.map((f) => (
                <span key={f.title}> — {f.caption}</span>
              ))}
            </li>
          ))}
        </ul>
      </noscript>
      <BulbRow count={23} className="act-bulbs" size={7} />
    </section>
  );
}
