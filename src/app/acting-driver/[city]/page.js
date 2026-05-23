import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  actingDriverDescription,
  actingDriverTitle,
  breadcrumbJsonLd,
  buildPageMetadata,
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
  const path = `/acting-driver/${city.slug}`;
  return buildPageMetadata({
    title: actingDriverTitle(city.name),
    description: actingDriverDescription(city.name, city.state),
    path,
    keywords: [
      `acting driver ${city.name.toLowerCase()}`,
      `driver on hire ${city.name.toLowerCase()}`,
      `chauffeur ${city.name.toLowerCase()}`,
      "cabzii acting driver"
    ]
  });
}

export default function ActingDriverCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/acting-driver/${city.slug}`;
  const faqs = getCityFaqs(city, "driver");
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
      { name: `Acting driver ${city.name}`, path }
    ]),
    localBusinessJsonLd(city.name, city.region),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="driver" />
    </>
  );
}
