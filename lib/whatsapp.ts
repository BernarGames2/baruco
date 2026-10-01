import { site } from "@/content/site";

/** Mensagem padrão do fluxo de reserva (texto definido no briefing). */
export function bookingMessage(opts: { service?: string; when?: string; name?: string }): string {
  const service = opts.service?.trim() || "um horário";
  const when = opts.when?.trim();
  const name = opts.name?.trim();
  let msg = `Olá! Vim pelo site do Baruco e quero agendar ${service}`;
  if (when) msg += ` em ${when}`;
  msg += ".";
  if (name) msg += ` Meu nome é ${name}.`;
  return msg;
}

/** Link wa.me com mensagem pronta, ou `null` enquanto o número oficial estiver A CONFIRMAR. */
export function whatsappLink(message: string): string | null {
  const n = site.contact.whatsappNumber?.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export const hasWhatsapp = (): boolean => Boolean(site.contact.whatsappNumber);
