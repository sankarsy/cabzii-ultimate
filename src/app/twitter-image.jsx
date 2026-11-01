import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "Cabzii — Cabs and Acting Drivers";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return cabziiOgImage({
    headline: "Cabs and Acting Drivers",
    subline: "Airport taxi · Outstation · Acting driver"
  });
}
