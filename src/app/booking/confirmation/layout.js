import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Booking confirmed | Cabzii",
  description: "Your Cabzii booking confirmation.",
  path: "/booking/confirmation",
  noindex: true
});

export default function BookingConfirmationLayout({ children }) {
  return children;
}
