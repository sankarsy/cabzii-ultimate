import { cityBySlug, isMainPageCity } from "../../lib/seo/cities";
import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "City taxi service on Cabzii";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }) {
  const city = cityBySlug(params.city);
  const name = city && isMainPageCity(city.slug) ? city.name : "India";
  return cabziiOgImage({
    headline: `Taxi Service in ${name}`,
    subline: "Outstation · Airport · Local cabs · Pay 50% to confirm"
  });
}
