import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
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
  return buildPageMetadata({
    title: cms?.seoTitle || tunedCabBookingTitle(city),
    description: cms?.seoDescription || tunedCabBookingDescription(city),
    path,
    keywords
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
      priceHigh: CITY_CAB_PRICE_RANGE.high
    }),
    localBusinessJsonLd(city.name, city.state, path),
    faqFromPairs(faqs)
  ];

  const extraBody = cms?.body
    ? `${cms.body}${getCityLandingBody(city, "cab") || ""}`
    : getCityLandingBody(city, "cab");

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="cab" extraBody={extraBody} headingOverride={cms?.h1 || ""} />
    </>
  );
}
