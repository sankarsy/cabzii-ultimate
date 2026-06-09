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
  return buildPageMetadata({
    title: tunedCabBookingTitle(city),
    description: tunedCabBookingDescription(city),
    path,
    keywords: tunedCabBookingKeywords(city)
  });
}

export default function CabBookingCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/cab-booking/${city.slug}`;
  const faqs = getCityFaqs(city, "cab");
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cabs", path: "/cabs" },
      { name: city.name, path }
    ]),
    cityCabSearchJsonLd(city, {
      productName: tunedCabBookingTitle(city),
      description: tunedCabBookingDescription(city),
      urlPath: path,
      priceLow: CITY_CAB_PRICE_RANGE.low,
      priceHigh: CITY_CAB_PRICE_RANGE.high
    }),
    localBusinessJsonLd(city.name, city.state, path),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="cab" extraBody={getCityLandingBody(city, "cab")} />
    </>
  );
}
