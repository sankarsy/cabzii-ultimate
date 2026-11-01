import { buildPageMetadata } from "../../lib/seo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: "Search Cabs, Buses & Call Driver | Cabzii",
  description: "Search Cabzii for cabs, bus tickets and Call Driver. Fares shown before you confirm.",
  path: "/search",
  noindex: true
});

export default function SearchLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
