import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Cab Search Results | Cabzii",
  description: "Compare cab fares for your trip on Cabzii.",
  path: "/cabs/results",
  noindex: true
});

export default function CabResultsLayout({ children }) {
  return children;
}
