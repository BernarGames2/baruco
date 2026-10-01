import { site } from "@/content/site";
import { ActSlate } from "@/components/ActSlate";
import { WhatsAppWizard } from "@/components/WhatsAppWizard";
import { GreenroomCard } from "@/components/GreenroomCard";
import { MapFacade } from "@/components/MapFacade";
import { MagneticButton } from "@/components/MagneticButton";
import { InstagramGlyph } from "@/components/Icons";

/** ATO VI — CAMARIM RESERVADO: agendamento + horários + como chegar. */
export function ActReserved() {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.mapsQuery)}`;
  return (
    <section id="ato-6" aria-labelledby="ato-6-title" className="act act-reserved">
      <ActSlate
        numeral="VI"
        title="Camarim *Reservado*"
        titleId="ato-6-title"
        line="Três cenas rápidas e a sua mensagem sai pronta para o WhatsApp do salão."
      />

      <div className="reserve-grid">
        <div id="reservar" className="reserve-main" aria-label="Reservar horário">
          <WhatsAppWizard />
        </div>
        <GreenroomCard />
      </div>

      <div className="visit-grid">
        <MapFacade />
        <address className="ticket">
          <span className="ticket-notch ticket-notch-l" aria-hidden="true" />
          <span className="ticket-notch ticket-notch-r" aria-hidden="true" />
          <p className="mono ticket-kicker">Endereço do camarim</p>
          <p className="display ticket-street">{site.address.street}</p>
          <p className="ticket-city">
            {site.address.district} · {site.address.city}/{site.address.state} · CEP {site.address.postalCode}
          </p>
          <div className="ticket-perf" aria-hidden="true" />
          <p className="ticket-phone">
            <span className="mono">Telefone</span>
            <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>
          </p>
          <div className="ticket-actions">
            <MagneticButton href={directions} external>
              Como chegar
            </MagneticButton>
            <MagneticButton href={site.instagram.url} external variant="ghost">
              <InstagramGlyph className="h-5 w-5" /> {site.instagram.handle}
            </MagneticButton>
          </div>
        </address>
      </div>
    </section>
  );
}
