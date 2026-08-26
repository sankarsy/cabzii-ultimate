import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  cityGeo,
  cityCabSearchJsonLd,
  faqFromPairs,
  getCityFaqs,
  localBusinessJsonLd,
  tunedCabBookingDescription,
  tunedCabBookingKeywords,
  tunedCabBookingTitle,
  CITY_CAB_PRICE_RANGE
} from "../../../lib/seo";
import { getCityLandingBody } from "../../../lib/seo/landingContent";
import { fetchSeoCityPage } from "../../../lib/serverCatalog";
import { fetchSiteReviewStats } from "../../../lib/serverReviewStats";
import { formatSerpPrice } from "../../../lib/seo/serpRichData";
import { resolveMediaUrl } from "../../../lib/media";

export const revalidate = 600;

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Cab Booking",
      description: "City cab booking page on Cabzii.",
      path: `/cab-booking/${params.city}`,
      noindex: true
    });
  }
  const path = `/cab-booking/${city.slug}`;
  const cms = await fetchSeoCityPage("cab-booking", city.slug);
  const keywords = cms?.seo
    ? cms.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedCabBookingKeywords(city);
  const cmsImage = resolveMediaUrl(cms?.image || cms?.banner || "");
  return buildPageMetadata({
    title: cms?.seoTitle || tunedCabBookingTitle(city),
    description: cms?.seoDescription || tunedCabBookingDescription(city),
    path,
    keywords,
    ...(cmsImage ? { image: cmsImage, imageAlt: `Cab booking in ${city.name}` } : {})
  });
}

export default async function CabBookingCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/cab-booking/${city.slug}`;
  const cms = await fetchSeoCityPage("cab-booking", city.slug);
  const title = cms?.seoTitle || tunedCabBookingTitle(city);
  const description = cms?.seoDescription || tunedCabBookingDescription(city);
  const faqs = getCityFaqs(city, "cab");
  const reviewStats = await fetchSiteReviewStats();
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cabs", path: "/cabs" },
      { name: city.name, path }
    ]),
    cityCabSearchJsonLd(city, {
      productName: title,
      description,
      urlPath: path,
      priceLow: CITY_CAB_PRICE_RANGE.low,
      priceHigh: CITY_CAB_PRICE_RANGE.high,
      reviewStats
    }),
    localBusinessJsonLd(city.name, city.state, path, cityGeo(city.slug)),
    faqFromPairs(faqs)
  ];

  const extraBody = (() => {
    const generated = getCityLandingBody(city, "cab") || "";
    const cmsBody = typeof cms?.body === "string" ? cms.body.trim() : "";
    /* Prefer unique CMS body when substantial; avoid stacking duplicate long templates */
    if (cmsBody.length > 400) return cmsBody;
    if (cmsBody && generated) return `${cmsBody}${generated}`;
    return cmsBody || generated;
  })();

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage
        city={city}
        variant="cab"
        extraBody={extraBody}
        headingOverride={cms?.h1 || ""}
        reviewStats={reviewStats}
        priceFrom={CITY_CAB_PRICE_RANGE.low}
      />
    </>
  );
}
