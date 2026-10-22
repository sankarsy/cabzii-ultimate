import { permanentRedirect } from "next/navigation";
import JsonLd from "../../../components/seo/JsonLd";
import CityCabLandingPage from "../../../components/city-cabs/CityCabLandingPage";
import SeoPageView from "../../../components/seo/SeoPageView";
import { buildPageMetadata, SITE_URL } from "../../../lib/seo";
import { cityHubStaticParams } from "../../../data/city-cabs";
import { buildCityCabJsonLd } from "../../../lib/schema";
import { fetchCabsForTrip, fetchCatalogList } from "../../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { ORG_PHONE, SOCIAL_PROFILES, SITE_LOGO, SITE_NAME } from "../../../lib/seo/constants";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";
import { getSeoPage } from "../../../lib/seo/getSeoPage";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

export function generateStaticParams() {
  return cityHubStaticParams();
}

export async function generateMetadata({ params }) {
  const page = await getSeoPage({ type: "cab-booking", city: params.city });
  if (!page.live || !page.data) {
    return buildPageMetadata({
      title: "City Cabs",
      description: "City taxi landing on Cabzii.",
      path: `/cab-booking/${params.city}`,
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

export default async function CabBookingCityPage({ params }) {
  const page = await getSeoPage({ type: "cab-booking", city: params.city });
  if (!page.live || !page.city || !page.data) permanentRedirect("/cabs");

  const { city, data, path } = page;
  const [cabs, reviewStats, testimonialRows] = await Promise.all([
    fetchCabsForTrip(data.bookingTrip, 100),
    fetchSiteReviewStats(),
    fetchCatalogList("testimonials", 8)
  ]);
  const quotes = (Array.isArray(testimonialRows) ? testimonialRows : [])
    .filter((row) => row && !row.sampleReview && String(row.message || "").trim())
    .slice(0, 2);
  const jsonLd = buildCityCabJsonLd({
    cityName: city.name,
    pageUrl: `${SITE_URL}${path}`,
    path,
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
      <CityCabLandingPage
        data={data}
        cabs={JSON.parse(JSON.stringify(cabs || []))}
        quotes={JSON.parse(JSON.stringify(quotes || []))}
      />
    </>
  );
}
