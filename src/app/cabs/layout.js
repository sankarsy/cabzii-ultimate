import { buildPageMetadata, cabsCatalogJsonLd, formatSerpTitle } from "../../lib/seo";
import JsonLd from "../../components/seo/JsonLd";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: formatSerpTitle("Book Cabs & Taxis Online", "Dzire, Ertiga, Innova"),
  description:
    "Book Maruti Dzire, Ertiga, Toyota Innova Crysta taxi cars and Force Tempo Traveller van/bus with transparent fares. Outstation, airport and local cab booking on cabzii.in.",
  path: "/cabs",
  keywords: [
    "Maruti Dzire cab booking",
    "Ertiga taxi",
    "Innova Crysta cab hire",
    "tempo traveller booking",
    "taxi car rental",
    "van bus hire",
    "outstation cab",
    "airport taxi",
    "cabzii cabs"
  ]
});

export default function CabsLayout({ children }) {
  return (
    <>
      <JsonLd data={cabsCatalogJsonLd()} />
      <TravelLayoutClient>{children}</TravelLayoutClient>
    </>
  );
}
