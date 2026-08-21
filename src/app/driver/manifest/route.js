import { NextResponse } from "next/server";
import { BRAND_ICON, BRAND_ICON_SM } from "../../../lib/brandAssets";

export function GET() {
  return NextResponse.json({
    name: "Cabzii Driver",
    short_name: "Cabzii Driver",
    description: "Cabzii driver trips and live tracking.",
    start_url: "/driver",
    scope: "/driver",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0EA5E9",
    icons: [
      { src: BRAND_ICON_SM, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: BRAND_ICON, sizes: "512x512", type: "image/png", purpose: "any" }
    ]
  });
}
