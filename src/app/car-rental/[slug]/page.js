import { notFound } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import CityCabLandingPage from "../../../components/city-cabs/CityCabLandingPage";
import { buildPageMetadata, cityBySlug, classifyCityHub, SITE_URL } from "../../../lib/seo";
import { getCityCabData, cityCabStaticParams } from "../../../data/city-cabs";
import { parseCityCabLandingSlug } from "../../../lib/cityCabPaths";
import { buildCityCabJsonLd } from "../../../lib/schema";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { ORG_PHONE, SOCIAL_PROFILES, SITE_LOGO, SITE_NAME } from "../../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return cityCabStaticParams();
}

function resolveCity(slugParam) {
  const citySlug = parseCityCabLandingSlug(slugParam);
  if (!citySlug) return null;
  return cityBySlug(citySlug);
}

export async function generateMetadata({ params }) {
  const city = resolveCity(params.slug);
  if (!city) {
    return buildPageMetadata({
      title: "City Cabs",
      description: "City taxi landing on Cabzii.",
      path: `/car-rental/${params.slug}`,
      noindex: true,
      follow: false
    });
  }
  const data = getCityCabData(city.slug);
  const indexPolicy = classifyCityHub(city.slug, "cab-booking");
  const meta = buildPageMetadata({
    title: data.title,
    description: data.description,
    path: data.path,
    noindex: !indexPolicy.indexable,
    follow: indexPolicy.follow,
    image: `/car-rental/${params.slug}/opengraph-image`,
    imageAlt: data.heroAlt,
    imageWidth: 1200,
    imageHeight: 630
  });
  return { ...meta, keywords: [] };
}

export default async function CityCabLandingRoute({ params }) {
  const city = resolveCity(params.slug);
  if (!city) notFound();

  const data = getCityCabData(city.slug);
  if (!data) notFound();

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
      <JsonLd data={jsonLd} />
      <CityCabLandingPage data={data} />
    </>
  );
}
