import { notFound } from "next/navigation";
import JsonLd from "../../components/seo/JsonLd";
import CityCabLandingPage from "../../components/city-cabs/CityCabLandingPage";
import SeoPageView from "../../components/seo/SeoPageView";
import { buildPageMetadata, cityBySlug, classifyCityHub, SITE_URL } from "../../lib/seo";
import { applyCityCabCms, getCityCabData, cityHubStaticParams } from "../../data/city-cabs";
import { buildCityCabJsonLd } from "../../lib/schema";
import { fetchCabsForTrip, fetchSeoCityPage } from "../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../lib/serverReviewStats";
import { ORG_PHONE, SOCIAL_PROFILES, SITE_LOGO, SITE_NAME } from "../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";
import { isMainPageCity } from "../../lib/seo/cities";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return cityHubStaticParams();
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city || !isMainPageCity(city.slug)) {
    return buildPageMetadata({
      title: "City Cabs",
      description: "City taxi landing on Cabzii.",
      path: `/${params.city}`,
      noindex: true,
      follow: false
    });
  }
  const base = getCityCabData(city.slug);
  if (!base) {
    return buildPageMetadata({
      title: "City Cabs",
      description: "City taxi landing on Cabzii.",
      path: `/${params.city}`,
      noindex: true,
      follow: false
    });
  }
  const cms = await fetchSeoCityPage("cab-booking", city.slug);
  const data = applyCityCabCms(base, cms) || base;
  const indexPolicy = classifyCityHub(city.slug, "cab-booking");
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

export default async function CityCabHubPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city || !isMainPageCity(city.slug)) notFound();

  const base = getCityCabData(city.slug);
  if (!base) notFound();
  const cms = await fetchSeoCityPage("cab-booking", city.slug);
  const data = applyCityCabCms(base, cms) || base;
  const cabs = await fetchCabsForTrip(data.bookingTrip, 50);

  const reviewStats = await fetchSiteReviewStats();
  const jsonLd = buildCityCabJsonLd({
    cityName: city.name,
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
    reviewStats
  });

  return (
    <>
      <SeoPageView pageType="city" city={city.slug} />
      <JsonLd data={jsonLd} />
      <CityCabLandingPage data={data} cabs={JSON.parse(JSON.stringify(cabs || []))} />
    </>
  );
}
