import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import JsonLd from "../../components/seo/JsonLd";
import { buildPageMetadata, driversCatalogJsonLd, formatSerpTitle } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: formatSerpTitle("Hire Acting Drivers Online", "Dzire, Ertiga, Innova"),
  description:
    "Hire acting drivers for your Maruti Dzire, Ertiga, Toyota Innova or Tempo Traveller. Same 4hr/8hr & outstation packages as cab booking on cabzii.in.",
  path: "/drivers",
  keywords: [
    "acting driver Dzire",
    "Ertiga chauffeur hire",
    "Innova acting driver",
    "tempo traveller driver",
    "driver on hire",
    "chauffeur service",
    "cabzii acting driver"
  ]
});

export default function DriversLayout({ children }) {
  return (
    <>
      <JsonLd data={driversCatalogJsonLd()} />
      <TravelLayoutClient>{children}</TravelLayoutClient>
    </>
  );
}
