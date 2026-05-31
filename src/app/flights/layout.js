import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Flight Booking — Compare Fares",
  description: "Search and compare domestic flights on cabzii.in. Book cabs and holidays in one place.",
  path: "/flights",
  keywords: ["flight booking India", "cheap flights", "domestic flights", "cabzii flights"]
});

export default function FlightsLayout({ children }) {
  return children;
}
