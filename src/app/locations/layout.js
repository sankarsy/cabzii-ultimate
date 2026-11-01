import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import JsonLd from "../../components/seo/JsonLd";
import { buildPageMetadata, MAIN_PAGE_CITY_SLUGS, cityBySlug, locationsIndexJsonLd } from "../../lib/seo";

const LIVE_CITIES = MAIN_PAGE_CITY_SLUGS.map((slug) => cityBySlug(slug)).filter(Boolean);

export const metadata = buildPageMetadata({
  title: "Cab & Taxi Service Locations in South India | Cabzii",
  description:
    "Cabzii service areas across Chennai, Madurai, Tirupati, Trichy, Coimbatore and Vellore. Book cabs, acting drivers and bus tickets online.",
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
  return (
    <TravelLayoutClient>
      <JsonLd data={locationsIndexJsonLd(LIVE_CITIES)} />
      {children}
    </TravelLayoutClient>
  );
}
