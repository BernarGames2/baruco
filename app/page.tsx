import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { SpotlightCursor } from "@/components/SpotlightCursor";
import { ScriptNav } from "@/components/ScriptNav";
import { GoldThread } from "@/components/GoldThread";
import { ActEntrance } from "@/components/acts/ActEntrance";
import { ActChapters } from "@/components/acts/ActChapters";
import { ActRunway } from "@/components/acts/ActRunway";
import { ActBackstage } from "@/components/acts/ActBackstage";
import { ActReserved } from "@/components/acts/ActReserved";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileReserve } from "@/components/MobileReserve";
import { ConsentBanner } from "@/components/ConsentBanner";

/** O CAMARIM — seis Atos, sem seções de landing genérica. */
export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <SpotlightCursor />
      <ScriptNav />
      <GoldThread />
      <main id="conteudo">
        <ActEntrance />
        <ActChapters />
        <ActRunway />
        <ActBackstage />
        <ActReserved />
      </main>
      <SiteFooter />
      <MobileReserve />
      <ConsentBanner />
    </SmoothScroll>
  );
}
