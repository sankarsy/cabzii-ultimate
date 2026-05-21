import { notFound } from "next/navigation";
import CitySeoPage from "../../../components/CitySeoPage";
import {
  SEO_CITIES,
  cabBookingDescription,
  cabBookingTitle,
  cityBySlug,
  localBusinessJsonLd
} from "../../../lib/seo";

export function generateStaticParams() {
  return SEO_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) return {};
  const path = `/cab-booking/${city.slug}`;
  return {
    title: cabBookingTitle(city.name),
    description: cabBookingDescription(city.name, city.state),
    alternates: { canonical: path },
    keywords: [
      `cab booking ${city.name}`,
      `taxi ${city.name}`,
      `outstation cab ${city.name}`,
      "cabzii",
      `cab ${city.name}`
    ],
    openGraph: {
      title: cabBookingTitle(city.name),
      description: cabBookingDescription(city.name, city.state),
      url: path
    }
  };
}

export default function CabBookingCityPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const jsonLd = localBusinessJsonLd(city.name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CitySeoPage city={city} variant="cab" />
    </>
  );
}
