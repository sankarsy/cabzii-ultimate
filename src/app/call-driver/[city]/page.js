import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import CallDriverLanding from "../../../components/call-driver/CallDriverLanding";
import SeoPageView from "../../../components/seo/SeoPageView";
import { breadcrumbJsonLd, buildPageMetadata } from "../../../lib/seo";
import { SITE_URL } from "../../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import { fetchSiteSettings } from "../../../lib/serverSiteSettings";
import { mergeCallDriverPage } from "../../../lib/callDriverPage";
import { SEO_SCOPE_CITIES, normalizeSeoCitySlug } from "../../../config/seo-scope";
import { callDriverCityPath } from "../../../lib/cityCabPaths";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return SEO_SCOPE_CITIES.filter((city) => city.slug !== "chennai").map((city) => ({ city: city.slug }));
}

function resolveCallDriverCity(raw) {
  const slug = normalizeSeoCitySlug(raw);
  const city = SEO_SCOPE_CITIES.find((item) => item.slug === slug) || null;
  return { slug, city };
}

export async function generateMetadata({ params }) {
  const { slug, city } = resolveCallDriverCity(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Call Driver",
      description: "Book a Cabzii Call Driver for your own car.",
      path: `/call-driver/${params.city}`,
      noindex: true,
      follow: false
    });
  }
  const path = callDriverCityPath(slug);
  return buildPageMetadata({
    title: `Call Driver in ${city.name} | Cabzii`,
    description: `Hire a professional Cabzii driver for your own car in ${city.name}. Local, outstation, airport, monthly, corporate and valet — fare shown before you confirm.`,
    path,
    keywords: [`call driver ${city.name}`, `acting driver ${city.name}`, `hire a driver ${city.name}`, "cabzii"]
  });
}

export default async function CallDriverCityPage({ params }) {
  const raw = String(params.city || "");
  const { slug, city } = resolveCallDriverCity(raw);
  if (slug === "chennai") permanentRedirect("/call-driver");
  if (!city) notFound();
  if (slug !== raw.toLowerCase()) permanentRedirect(callDriverCityPath(slug));

  const settings = await fetchSiteSettings();
  const page = mergeCallDriverPage(settings.callDriverPage);
  const path = callDriverCityPath(slug);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Call Driver", path: "/call-driver" },
      { name: city.name, path }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Call Driver in ${city.name}`,
      serviceType: "Acting driver / call driver for own car",
      provider: { "@type": "Organization", name: "Cabzii", url: SITE_URL },
      areaServed: city.name,
      url: `${SITE_URL}${path}`,
      description: page.intro
    }
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <SeoPageView pageType="call-driver" city={city.slug} service="acting-driver" />
      <CallDriverLanding showSeoCopy city={city} intro={page.intro} sections={page.sections} />
    </>
  );
}
