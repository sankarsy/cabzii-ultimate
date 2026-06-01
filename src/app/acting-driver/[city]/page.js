import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import JsonLd from "../../../components/seo/JsonLd";
import {
  SEO_CITIES,
  breadcrumbJsonLd,
  buildPageMetadata,
  cityBySlug,
  cityDriverSearchJsonLd,
  faqFromPairs,
  getCityFaqs,
  localBusinessJsonLd,
  tunedActingDriverDescription,
  tunedActingDriverTitle,
  tunedActingDriverKeywords
} from "../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Acting Driver",
      description: "Acting driver hire on Cabzii.",
      path: `/acting-driver/${params.city}`,
      noindex: true
    });
  }
  const path = `/acting-driver/${city.slug}`;
  return buildPageMetadata({
    title: tunedActingDriverTitle(city),
    description: tunedActingDriverDescription(city),
    path,
    keywords: tunedActingDriverKeywords(city)
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
      { name: "Drivers", path: "/drivers" },
      { name: `Acting driver ${city.name}`, path }
    ]),
    cityDriverSearchJsonLd(city, {
      description: tunedActingDriverDescription(city),
      urlPath: path
    }),
    localBusinessJsonLd(city.name, city.state, path),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="driver" />
    </>
  );
}
