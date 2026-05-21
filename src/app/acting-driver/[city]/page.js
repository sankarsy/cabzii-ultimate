import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import {
  SEO_CITIES,
  actingDriverDescription,
  actingDriverTitle,
  cityBySlug,
  localBusinessJsonLd
} from "../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) return {};
  const path = `/acting-driver/${city.slug}`;
  return {
    title: actingDriverTitle(city.name),
    description: actingDriverDescription(city.name, city.state),
    alternates: { canonical: path },
    keywords: [
      `acting driver ${city.name}`,
      `driver on hire ${city.name}`,
      `chauffeur ${city.name}`,
      "cabzii acting driver"
    ],
    openGraph: {
      title: actingDriverTitle(city.name),
      description: actingDriverDescription(city.name, city.state),
      url: path
    }
  };
}

export default function ActingDriverCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const jsonLd = localBusinessJsonLd(city.name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CitySeoPage city={city} variant="driver" />
    </>
  );
}
