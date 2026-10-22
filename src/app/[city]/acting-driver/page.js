import { notFound, permanentRedirect } from "next/navigation";
import { cityBySlug } from "../../../lib/seo/cities";
import { actingDriverLandingPath } from "../../../lib/cityCabPaths";
import { isKeepActingDriverCity } from "../../../lib/seo/keepLivePages";

/** Legacy /{city}/acting-driver → canonical /acting-driver/{city}. */
export default function LegacyCityActingDriverRoute({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();
  if (!isKeepActingDriverCity(city.slug)) permanentRedirect("/call-driver");
  permanentRedirect(actingDriverLandingPath(city.slug));
}
