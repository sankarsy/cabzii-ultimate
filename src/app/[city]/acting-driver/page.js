import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import ActingDriverLandingPage from "../../../components/city-cabs/ActingDriverLandingPage";
import SeoPageView from "../../../components/seo/SeoPageView";
import {
  actingDriverServiceJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  classifyCityHub,
  faqFromPairs
} from "../../../lib/seo";
import { applyActingDriverCms, actingDriverHubStaticParams, getActingDriverHubData } from "../../../data/acting-driver-hubs";
import { fetchHomeCallDriverServices, fetchSeoCityPage } from "../../../lib/serverCatalog";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import { actingDriverLandingPath, cityCabLandingPath, isActingDriverHubCity } from "../../../lib/cityCabPaths";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return actingDriverHubStaticParams();
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (city && !isActingDriverHubCity(city.slug)) {
    permanentRedirect(actingDriverLandingPath(city.slug));
  }
  const base = city ? getActingDriverHubData(city.slug) : null;
  const path = actingDriverLandingPath(params.city);
  if (!base) {
    return buildPageMetadata({
      title: "Acting driver",
      description: "Acting driver / Call Driver landing on Cabzii.",
      path,
      noindex: true,
      follow: false
    });
  }
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const data = applyActingDriverCms(base, cms) || base;
  const indexPolicy = classifyCityHub(city.slug, "acting-driver");
  const keywords = String(data.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return buildPageMetadata({
    title: data.title,
    description: data.description,
    path: data.path,
    keywords,
    noindex: !indexPolicy.indexable,
    follow: indexPolicy.follow,
    image: `/${city.slug}/opengraph-image`,
    imageAlt: data.heroAlt,
    imageWidth: 1200,
    imageHeight: 630
  });
}

export default async function CityActingDriverPage({ params }) {
  const city = cityBySlug(params.city);
  if (city && !isActingDriverHubCity(city.slug)) {
    permanentRedirect(actingDriverLandingPath(city.slug));
  }
  const base = city ? getActingDriverHubData(city.slug) : null;
  if (!base) notFound();

  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const data = applyActingDriverCms(base, cms) || base;
  const services = await fetchHomeCallDriverServices();
  const faqPairs = (data.faqs || []).map((row) => [row.question, row.answer]);
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: `${city.name} cabs`, path: cityCabLandingPath(city.slug) },
      { name: `Acting driver in ${city.name}`, path: data.path }
    ]),
    actingDriverServiceJsonLd(city, { description: data.description, urlPath: data.path }),
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
