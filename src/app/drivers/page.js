import JsonLd from "../../components/seo/JsonLd";
import CallDriverLanding from "../../components/call-driver/CallDriverLanding";
import { breadcrumbJsonLd } from "../../lib/seo";
import { SITE_URL } from "../../lib/seo/constants";

export default function DriversPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Call Driver", path: "/call-driver" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Call Driver in Chennai | Acting Driver Service",
      url: `${SITE_URL}/call-driver`,
      provider: { "@type": "Organization", name: "Cabzii" }
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CallDriverLanding />
    </>
  );
}
