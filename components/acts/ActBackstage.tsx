import { backstageMural, site } from "@/content/site";
import { ActSlate } from "@/components/ActSlate";
import { CounterStat } from "@/components/CounterStat";
import { BulbRow } from "@/components/BulbRow";
import { Media } from "@/components/Media";
import { Pending } from "@/components/Pending";
import { MagneticButton } from "@/components/MagneticButton";
import { InstagramEmbeds } from "@/components/InstagramMural";
import { InstagramGlyph } from "@/components/Icons";
import { ParallaxPins } from "@/components/ParallaxPins";

const ROT = [-5, 3, -2, 6, -4];

/** ATO V — OS BASTIDORES: números reais do perfil e mural. */
export function ActBackstage() {
  const ig = site.instagram;

  return (
    <section id="ato-5" aria-labelledby="ato-5-title" className="act act-backstage">
      <ActSlate
        numeral="V"
        title="Os *Bastidores*"
        titleId="ato-5-title"
        line="Conteúdo viral é coisa séria. Do outro lado da câmera, o salão continua em cena."
      />

      {/* Letreiro "em cartaz" */}
      <div className="billboard">
        <BulbRow count={21} mode="scroll" size={9} className="billboard-bulbs" />
        <div className="billboard-body">
          <p className="mono billboard-kicker">Em cartaz no Instagram · {ig.handle}</p>
          <div className="billboard-stats">
            <CounterStat value={ig.followers.value} display={ig.followers.display} format="mil" label={ig.followers.label} />
            <span className="billboard-sep" aria-hidden="true" />
            <CounterStat value={ig.posts.value} display={ig.posts.display} format="int" label={ig.posts.label} />
          </div>
          <p className="billboard-note">
            Dados do perfil {ig.handle} em {ig.referenceDate} — “{ig.category}”.
          </p>
          <MagneticButton href={ig.url} external variant="ghost">
            <InstagramGlyph className="h-5 w-5" /> Seguir {ig.handle}
          </MagneticButton>
        </div>
        <BulbRow count={21} mode="scroll" size={9} className="billboard-bulbs" />
      </div>

      <div className="backstage-grid backstage-solo">
        {/* Mural de camarim */}
        <div className="mural" aria-labelledby="mural-title">
          <h3 id="mural-title" className="sr-only">
            Mural de bastidores
          </h3>
          <div className="mural-board">
            <ParallaxPins>
              {backstageMural.map((m, i) => (
                <figure key={m.shot} className={`polaroid polaroid-${i + 1}`} style={{ rotate: `${ROT[i]}deg` }}>
                  <span className="pin" aria-hidden="true" />
                  <div className="polaroid-img">
                    <Media slot={m} sizes="(max-width: 767px) 45vw, 18vw" compact />
                  </div>
                  <figcaption className="mono">{m.shot} · a confirmar</figcaption>
                </figure>
              ))}
            </ParallaxPins>
          </div>
          <InstagramEmbeds />
          {!ig.embedPosts.length ? <Pending>posts/reels autorizados para o mural</Pending> : null}
        </div>
      </div>
    </section>
  );
}
