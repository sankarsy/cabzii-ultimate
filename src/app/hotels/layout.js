import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Hotel Booking — Stays Across India",
  description: "Find hotels and resorts on cabzii.in. Pair your stay with cabs and holiday packages.",
  path: "/hotels",
  keywords: ["hotel booking India", "hotels Goa Kerala", "cabzii hotels"]
});

export default function HotelsLayout({ children }) {
  return children;
}
