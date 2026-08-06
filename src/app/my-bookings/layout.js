import { buildPageMetadata } from "../../lib/seo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: "My Bookings | Cabzii",
  description: "View and manage your Cabzii bookings.",
  path: "/my-bookings",
  noindex: true
});

export default function MyBookingsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
