import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Customer Reviews — Cabzii",
  description: "Read verified reviews for cabs, acting drivers and holiday packages booked on cabzii.in.",
  path: "/testimonials",
  keywords: ["cabzii reviews", "cab booking reviews", "pilgrimage tour reviews"]
});

export default function TestimonialsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
