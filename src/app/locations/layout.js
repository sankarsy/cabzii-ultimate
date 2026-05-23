import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Cab Booking Cities & Pickup Locations | Cabzii",
  description:
    "Browse Cabzii service cities across South India — Chennai, Bengaluru, Hyderabad, Coimbatore and more. Find cab booking, airport taxi and acting driver pages.",
  path: "/locations",
  keywords: ["cab cities India", "cab booking locations", "cabzii cities", "taxi service South India"]
});

export default function LocationsLayout({ children }) {
  return children;
}
