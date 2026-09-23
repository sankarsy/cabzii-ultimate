import JsonLd from "../../components/seo/JsonLd";
import CallDriverLanding from "../../components/call-driver/CallDriverLanding";
import SeoPageView from "../../components/seo/SeoPageView";
import { breadcrumbJsonLd, faqFromPairs } from "../../lib/seo";
import { CHENNAI_DRIVER_FAQS } from "../../lib/seo/chennaiCluster";
import { SITE_URL } from "../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";
import { fetchSiteSettings } from "../../lib/serverSiteSettings";
import { buildMetadataForPath } from "../../lib/seo/resolvePageSeo";
import { mergeCallDriverPage } from "../../lib/callDriverPage";

export const revalidate = SEO_REVALIDATE_SECONDS;

export async function generateMetadata() {
  const settings = await fetchSiteSettings();
  return {
    ...buildMetadataForPath("/call-driver", settings),
    authors: [{ name: "Cabzii" }],
    publisher: "Cabzii"
  };
}

export default async function CallDriverPage() {
  const settings = await fetchSiteSettings();
  const page = mergeCallDriverPage(settings.callDriverPage);
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
      description: page.intro
    },
    faqFromPairs(CHENNAI_DRIVER_FAQS)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <SeoPageView pageType="call-driver" city="chennai" service="acting-driver" />
      <CallDriverLanding showSeoCopy title={page.title} subtitle={page.subtitle} intro={page.intro} sections={page.sections} />
    </>
  );
}
