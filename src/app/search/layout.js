import { buildPageMetadata } from "../../lib/seo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: "Search | Cabzii",
  description: "Search cabs, drivers and packages on Cabzii.",
  path: "/search",
  noindex: true
});

export default function SearchLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
