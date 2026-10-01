"use client";

import { useEffect, useState } from "react";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { scrollToHash } from "@/lib/acts";
import { haptic, track } from "@/lib/analytics";
import { WhatsAppGlyph } from "@/components/Icons";

/** Botão fixo "Reservar" (mobile). Some no hero e quando o Ato VI está na tela. */
export function MobileReserve() {
  const [show, setShow] = useState(false);
  const link = whatsappLink(bookingMessage({}));

  useEffect(() => {
    let inReserve = false;
    const target = document.getElementById("ato-6");
    const io = target
      ? new IntersectionObserver(([e]) => {
          inReserve = e.isIntersecting;
          update();
        })
      : null;
    if (target) io!.observe(target);
    function update() {
      setShow(window.scrollY > window.innerHeight * 0.9 && !inReserve);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <a
      className={`mreserve ${show ? "is-on" : ""}`}
      href={link ?? "#reservar"}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={(e) => {
        haptic();
        track("whatsapp_click", { from: "mobile_button" });
        if (!link) {
          e.preventDefault();
          scrollToHash("#reservar");
        }
      }}
    >
      <WhatsAppGlyph className="h-5 w-5" />
      Reservar
    </a>
  );
}
