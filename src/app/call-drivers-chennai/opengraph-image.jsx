import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "Acting drivers and call drivers in Chennai on Cabzii";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return cabziiOgImage({
    headline: "Acting Drivers in Chennai",
    subline: "Call Driver for your own car · City · Airport · Outstation"
  });
}
