import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import ActingDriverLandingPage from "../../../components/city-cabs/ActingDriverLandingPage";
import SeoPageView from "../../../components/seo/SeoPageView";
import { actingDriverServiceJsonLd, breadcrumbJsonLd, buildPageMetadata, faqFromPairs } from "../../../lib/seo";
import { actingDriverHubStaticParams } from "../../../data/acting-driver-hubs";
import { fetchHomeCallDriverServices } from "../../../lib/serverCatalog";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import { cityCabLandingPath } from "../../../lib/cityCabPaths";
import { getSeoPage } from "../../../lib/seo/getSeoPage";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return actingDriverHubStaticParams();
}

export async function generateMetadata({ params }) {
  const page = await getSeoPage({ type: "acting-driver", city: params.city });
  const path = `/acting-driver/${params.city}`;
  if (!page.live || !page.data) {
    return buildPageMetadata({
      title: "Acting driver",
      description: "Acting driver / Call Driver landing on Cabzii.",
      path,
      noindex: true,
      follow: false
    });
  }
  const { city, data, noindex, follow, canonicalIsAbsolute } = page;
  const keywords = String(data.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return buildPageMetadata({
    title: data.title,
    description: data.description,
    path: canonicalIsAbsolute ? data.path : data.canonicalPath || data.path,
    url: canonicalIsAbsolute ? data.canonicalPath : undefined,
    keywords,
    noindex,
    follow,
    image: data.ogImage || `/${city.slug}/opengraph-image`,
    imageAlt: data.heroAlt,
    imageWidth: 1200,
    imageHeight: 630
  });
}

export default async function ActingDriverCityPage({ params }) {
  const page = await getSeoPage({ type: "acting-driver", city: params.city });
  if (!page.city) notFound();
  if (!page.live || !page.data) permanentRedirect("/call-driver");

  const { city, data, path } = page;
  const services = await fetchHomeCallDriverServices();
  const faqPairs = (data.faqs || []).map((row) => [row.question, row.answer]);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: `${city.name} cabs`, path: cityCabLandingPath(city.slug) },
      { name: `Acting driver in ${city.name}`, path: path }
    ]),
    actingDriverServiceJsonLd(city, { description: data.description, urlPath: path }),
    faqFromPairs(faqPairs)
  ];

  return (
    <>
      <SeoPageView pageType="acting-driver" city={city.slug} />
      <JsonLd data={jsonLd} />
      <ActingDriverLandingPage data={data} services={JSON.parse(JSON.stringify(services || []))} />
    </>
  );
}
