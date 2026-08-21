import { buildPageMetadata } from "../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Track trip | Cabzii",
  description: "Live cab tracking for your booking.",
  path: "/my-bookings",
  noindex: true
});

export default function TrackTripLayout({ children }) {
  return children;
}
