import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import AirportCabLandingPage from "../../../components/city-cabs/AirportCabLandingPage";
import SeoPageView from "../../../components/seo/SeoPageView";
import { buildPageMetadata, cityBySlug, classifyServiceCity, SITE_URL } from "../../../lib/seo";
import { applyAirportCabCms, airportHubStaticParams, getAirportCabData } from "../../../data/airport-cabs";
import { buildCityCabJsonLd } from "../../../lib/schema";
import { fetchCabsForTrip, fetchSeoCityPage } from "../../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { ORG_PHONE, SOCIAL_PROFILES, SITE_LOGO, SITE_NAME } from "../../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import { airportCabBookingPath, cityCabLandingPath } from "../../../lib/cityCabPaths";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return airportHubStaticParams();
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  const base = city ? getAirportCabData(city.slug) : null;
  const path = airportCabBookingPath(params.city);
  if (!base) {
    return buildPageMetadata({
      title: "Airport cab booking",
      description: "Airport taxi landing on Cabzii.",
      path,
      noindex: true,
      follow: false
    });
  }
  const cms = await fetchSeoCityPage("airport-cab-booking", city.slug);
  const data = applyAirportCabCms(base, cms) || base;
  const indexPolicy = classifyServiceCity("airport-taxi", city.slug);
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

export default async function CityAirportCabBookingPage({ params }) {
  const city = cityBySlug(params.city);
  const base = city ? getAirportCabData(city.slug) : null;
  if (!base) notFound();

  const cms = await fetchSeoCityPage("airport-cab-booking", city.slug);
  const data = applyAirportCabCms(base, cms) || base;
  const cabs = await fetchCabsForTrip(data.bookingTrip, 50);
  const reviewStats = await fetchSiteReviewStats();
  const jsonLd = buildCityCabJsonLd({
    cityName: `${city.name} Airport`,
    pageUrl: `${SITE_URL}${data.path}`,
    path: data.path,
    telephone: ORG_PHONE,
    priceRange: data.priceRange,
    cabTypes: data.cabTypes,
    faqs: data.faqs,
    siteUrl: SITE_URL,
    siteName: SITE_NAME,
    logoUrl: SITE_LOGO,
    sameAs: SOCIAL_PROFILES,
    description: data.description,
    reviewStats,
    breadcrumbItems: [
      { name: "Home", item: `${SITE_URL}/` },
      { name: `${city.name} Cabs`, item: `${SITE_URL}${cityCabLandingPath(city.slug)}` },
      { name: `${city.name} Airport Cabs`, item: `${SITE_URL}${data.path}` }
    ]
  });

  return (
    <>
      <SeoPageView pageType="service" city={city.slug} service="airport-taxi" />
      <JsonLd data={jsonLd} />
      <AirportCabLandingPage data={data} cabs={JSON.parse(JSON.stringify(cabs || []))} />
    </>
  );
}
