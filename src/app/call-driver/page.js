import JsonLd from "../../components/seo/JsonLd";
import CallDriverLanding from "../../components/call-driver/CallDriverLanding";
import { breadcrumbJsonLd } from "../../lib/seo";
import { SITE_URL } from "../../lib/seo/constants";

export const metadata = {
  title: "Call Driver in Chennai | Acting Driver Service | Cabzii",
  description:
    "Book a call driver in Chennai for your own car. Acting driver, outstation driver, airport call driver, monthly driver, corporate driver and valet parking — Cabzii assigns a professional driver after you book.",
  alternates: { canonical: `${SITE_URL}/call-driver` },
  keywords: [
    "call driver Chennai",
    "acting driver Chennai",
    "driver for own car Chennai",
    "outstation driver Chennai",
    "airport call driver Chennai",
    "monthly driver Chennai",
    "corporate driver service Chennai"
  ]
};

export default function CallDriverPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Call Driver", path: "/call-driver" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Call Driver in Chennai | Acting Driver Service",
      serviceType: "Acting driver / call driver for own car",
      provider: { "@type": "Organization", name: "Cabzii", url: SITE_URL },
      areaServed: "Chennai",
      url: `${SITE_URL}/call-driver`,
      description:
        "Professional call driver and acting driver service in Chennai for local, outstation, airport, monthly, corporate and valet parking bookings."
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CallDriverLanding showSeoCopy title="Call Driver Services" />
    </>
  );
}
