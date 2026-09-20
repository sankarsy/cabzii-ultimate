import { notFound, permanentRedirect } from "next/navigation";
import { cityBySlug, MAIN_PAGE_CITY_SLUGS } from "../../../lib/seo";
import { cityCabLandingPath } from "../../../lib/cityCabPaths";

export const dynamicParams = true;

export function generateStaticParams() {
  return MAIN_PAGE_CITY_SLUGS.map((city) => ({ city }));
}

export function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return { robots: { index: false, follow: false } };
  }
  permanentRedirect(cityCabLandingPath(city.slug));
}

export default function CabBookingCityRedirect({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();
  permanentRedirect(cityCabLandingPath(city.slug));
}
