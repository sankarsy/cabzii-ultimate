import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Book Your Ride",
  description: "Complete your Cabzii cab or tour booking.",
  path: "/booking",
  noindex: true
});

export default function BookingLayout({ children }) {
  return children;
}
