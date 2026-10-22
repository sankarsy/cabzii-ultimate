import { notFound, permanentRedirect } from "next/navigation";
import { cityBySlug } from "../../lib/seo/cities";
import { cityCabLandingPath } from "../../lib/cityCabPaths";
import { isKeepSeoCity } from "../../lib/seo/keepLivePages";

/** Legacy /{city} → canonical /cab-booking/{city}. */
export default function LegacyCityCabHubRoute({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();
  if (isKeepSeoCity(city.slug)) permanentRedirect(cityCabLandingPath(city.slug));
  permanentRedirect("/cabs");
}
