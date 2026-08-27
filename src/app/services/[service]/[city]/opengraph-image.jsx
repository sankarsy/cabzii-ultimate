import { cityBySlug } from "../../../../lib/seo/cities";
import { serviceBySlug } from "../../../../lib/seo/services";
import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../../../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "Chauffeur-driven cab booking on Cabzii";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({ params }) {
  const city = cityBySlug(params.city);
  const service = serviceBySlug(params.service);
  const name = city?.name || "India";
  const svc = service?.name || "Cab service";
  return cabziiOgImage({
    headline: `${svc} in ${name}`,
    subline: "Upfront fares · OTP booking · WhatsApp support"
  });
}
