import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cabBookingDescription,
  cabBookingTitle,
  cityBySlug,
  faqFromPairs,
  getCityFaqs,
  localBusinessJsonLd
} from "../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) return {};
  const path = `/cab-booking/${city.slug}`;
  return buildPageMetadata({
    title: cabBookingTitle(city.name),
    description: cabBookingDescription(city.name, city.state),
    path,
    keywords: [
      `cab booking ${city.name.toLowerCase()}`,
      `taxi ${city.name.toLowerCase()}`,
      `outstation cab ${city.name.toLowerCase()}`,
      `airport taxi ${city.name.toLowerCase()}`,
      "cabzii"
    ]
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
      { name: "Locations", path: "/locations" },
      { name: city.name, path }
    ]),
    localBusinessJsonLd(city.name, city.region),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="cab" />
    </>
  );
}
