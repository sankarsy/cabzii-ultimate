import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Customer Reviews — Cabzii",
  description: "Real customer reviews for cabs, acting drivers and holiday trips booked on cabzii.in. Write a review after your trip.",
  path: "/testimonials",
  keywords: ["cabzii reviews", "cab booking reviews", "pilgrimage tour reviews"]
});

export default function TestimonialsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
