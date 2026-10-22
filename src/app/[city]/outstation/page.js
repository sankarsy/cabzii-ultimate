import { notFound, permanentRedirect } from "next/navigation";
import { cityBySlug } from "../../../lib/seo/cities";
import { buildPageMetadata } from "../../../lib/seo";
import { outstationHubPath } from "../../../lib/seo/outstationPaths";

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (city) permanentRedirect(`/services/outstation-cab/${city.slug}`);
  return buildPageMetadata({
    title: "Outstation cabs",
    description: "Outstation cab routes on Cabzii.",
    path: outstationHubPath(params.city),
    noindex: true,
    follow: false
  });
}

export default function OutstationCityHubPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();
  permanentRedirect(`/services/outstation-cab/${city.slug}`);
}
