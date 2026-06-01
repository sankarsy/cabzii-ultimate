import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Cab & Taxi Service Locations in South India | Cabzii",
  description:
    "Cabzii service areas across Chennai, Bengaluru, Hyderabad, Coimbatore, Madurai, Tirupati and 20+ cities. Book cabs, acting drivers and holiday packages online.",
  path: "/locations",
  keywords: [
    "cab service locations",
    "taxi near me South India",
    "cabzii cities",
    "travels near me",
    "cab booking locations India"
  ]
});

export default function LocationsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
