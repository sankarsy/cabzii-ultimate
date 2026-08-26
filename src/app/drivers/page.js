import JsonLd from "../../components/seo/JsonLd";
import DriversCategorySeo from "../../components/seo/DriversCategorySeo";
import { breadcrumbJsonLd } from "../../lib/seo";
import { SITE_URL } from "../../lib/seo/constants";

export default function DriversPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Drivers", path: "/drivers" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Driver hire and chauffeur service",
      serviceType: "Acting driver / chauffeur for own car",
      provider: { "@type": "Organization", name: "Cabzii", url: SITE_URL },
      url: `${SITE_URL}/drivers`,
      description:
        "Book acting driver, chauffeur and driver-on-hire services on Cabzii. A professional driver is assigned after booking."
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <DriversCategorySeo />
    </>
  );
}
