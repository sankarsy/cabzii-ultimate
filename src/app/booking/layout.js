import { buildPageMetadata } from "../../lib/seo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: "Booking | Cabzii",
  description: "Complete your Cabzii trip booking.",
  path: "/booking",
  noindex: true
});

export default function BookingLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
