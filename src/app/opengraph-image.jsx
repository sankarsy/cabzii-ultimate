import { cabziiOgImage, OG_CONTENT_TYPE, OG_SIZE } from "../lib/seo/cabziiOgImage";

export const runtime = "edge";
export const alt = "Cabzii — Cabs, Drivers & Tours";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpenGraphImage() {
  return cabziiOgImage({
    headline: "Cabs, Drivers & Tours",
    subline: "Airport taxi · Outstation · Acting driver · Holidays"
  });
}
