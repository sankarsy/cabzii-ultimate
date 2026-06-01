import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Flight Booking — Compare Fares | Cabzii",
  description:
    "Search and compare domestic flights on cabzii.in. Pair flights with cabs, acting drivers and holiday packages.",
  path: "/flights",
  keywords: ["flight booking India", "cheap flights", "domestic flights", "cabzii flights"],
  noindex: true
});

export default function FlightsLayout({ children }) {
  return children;
}
