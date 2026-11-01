import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Customer Reviews & Ratings | Cabzii",
  description:
    "Read verified Cabzii customer reviews for cab booking, airport taxi, outstation trips and acting drivers across South India. Write a review after your trip.",
  path: "/testimonials",
  keywords: ["cabzii reviews", "cab booking reviews", "taxi service ratings"]
});

export default function TestimonialsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
