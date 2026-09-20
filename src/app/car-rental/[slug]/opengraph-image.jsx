import { cityBySlug } from "../../../lib/seo/cities";
import { parseCityCabLandingSlug } from "../../../lib/cityCabPaths";
import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "City taxi service on Cabzii";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }) {
  const citySlug = parseCityCabLandingSlug(params.slug);
  const city = citySlug ? cityBySlug(citySlug) : null;
  const name = city?.name || "India";
  return cabziiOgImage({
    headline: `Taxi Service in ${name}`,
    subline: "Outstation · Airport · Full-day cabs · Up to Rs 500 off"
  });
}
