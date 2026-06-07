import { BRAND_ICON, BRAND_ICON_SM } from "../lib/brandAssets";
import { SITE_NAME } from "../lib/seo";

export default function manifest() {
  return {
    name: `${SITE_NAME} — Online Cab, Taxi & Driver Booking`,
    short_name: SITE_NAME,
    description:
      "Book cabs, taxis, airport transfers, outstation trips, acting drivers and tour packages across South India on cabzii.in.",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0056D2",
    lang: "en-IN",
    dir: "ltr",
    categories: ["travel", "transportation", "business"],
    icons: [
      { src: BRAND_ICON_SM, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: BRAND_ICON, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: BRAND_ICON, sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
