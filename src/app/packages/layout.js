import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Tour Packages & Holidays",
  description: "Holiday packages — pilgrimage, beach and hill trips with cab type selection on cabzii.in.",
  path: "/holidays",
  keywords: ["holiday packages", "pilgrimage tour", "Tirupati package", "cabzii holidays"]
});

export default function PackagesLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
