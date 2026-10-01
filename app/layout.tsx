import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Manrope } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dmmono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: site.seo.title,
  description: site.seo.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.seo.locale,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — monograma BS e fita dourada` }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: ["/og.png"],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1226",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Decide antes do primeiro paint: movimento? preloader? (evita flash e salto de layout). */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!rm){d.classList.add('motion');var seen=false;try{seen=!!sessionStorage.getItem('baruco-camarim')}catch(e){}
if(!seen){d.classList.add('preload');setTimeout(function(){if(!window.__barucoPreloader)d.classList.remove('preload')},5000)}}}catch(e){}})();`;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function jsonLd() {
  const open = site.hours.filter((h) => h.open && h.close);
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.name,
    description: site.seo.description,
    url: site.seo.url,
    image: `${site.seo.url}/og.png`,
    telephone: site.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: open.map((h) => DAYS[h.day]),
        opens: open[0]?.open,
        closes: open[0]?.close,
      },
    ],
    sameAs: [site.instagram.url],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      </head>
      <body className="grain">
        <a href="#ato-1" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
