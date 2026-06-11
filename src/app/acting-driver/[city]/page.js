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

import { fetchSeoCityPage } from "../../../lib/serverCatalog";

export const revalidate = 600;

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
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const keywords = cms?.seo
    ? cms.seo.split(",").map((k) => k.trim()).filter(Boolean)
    : tunedActingDriverKeywords(city);
  return buildPageMetadata({
    title: cms?.seoTitle || tunedActingDriverTitle(city),
    description: cms?.seoDescription || tunedActingDriverDescription(city),
    path,
    keywords
  });
}

export default async function ActingDriverCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const path = `/acting-driver/${city.slug}`;
  const cms = await fetchSeoCityPage("acting-driver", city.slug);
  const title = cms?.seoTitle || tunedActingDriverTitle(city);
  const description = cms?.seoDescription || tunedActingDriverDescription(city);
  const faqs = getCityFaqs(city, "driver");
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Drivers", path: "/drivers" },
      { name: `Acting driver ${city.name}`, path }
    ]),
    cityDriverSearchJsonLd(city, {
      productName: title,
      description,
      urlPath: path
    }),
    localBusinessJsonLd(city.name, city.state, path),
    faqFromPairs(faqs)
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <CitySeoPage city={city} variant="driver" extraBody={cms?.body || ""} headingOverride={cms?.h1 || ""} />
    </>
  );
}
