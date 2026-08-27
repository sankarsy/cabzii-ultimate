import JsonLd from "../../components/seo/JsonLd";
import CallDriverLanding from "../../components/call-driver/CallDriverLanding";
import SeoPageView from "../../components/seo/SeoPageView";
import { breadcrumbJsonLd } from "../../lib/seo";
import { SITE_URL } from "../../lib/seo/constants";

export const metadata = {
  title: "Book Call Driver | Driver for Your Own Car | Cabzii",
  description:
    "Book a Cabzii Call Driver for your own car — local, outstation, airport chauffeur, monthly quote, corporate and valet. A professional driver is assigned after you confirm.",
  alternates: { canonical: `${SITE_URL}/call-driver` },
  keywords: [
    "call driver Chennai",
    "book acting driver",
    "driver for own car",
    "outstation driver",
    "airport call driver",
    "monthly driver",
    "corporate driver"
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
      <SeoPageView pageType="call-driver" city="chennai" service="acting-driver" />
      <CallDriverLanding showSeoCopy title="Book Call Driver" />
    </>
  );
}
