import { cityBySlug } from "../../../lib/seo/cities";
import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "Acting driver on Cabzii";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }) {
  const city = cityBySlug(params.city);
  const name = city?.name || "India";
  return cabziiOgImage({
    headline: `Acting Driver in ${name}`,
    subline: "Chauffeur on hire for your own car"
  });
}
