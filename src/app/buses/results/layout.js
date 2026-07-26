import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Search Results — Compare Operators & Fares | Cabzii",
  description: "Compare AC seater and sleeper buses by price, departure time and operator. Select boarding point and seats on Cabzii.in.",
  path: "/buses/results",
  noindex: true
});

export default function BusResultsLayout({ children }) {
  return children;
}
