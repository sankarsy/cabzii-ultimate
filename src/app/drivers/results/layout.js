import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Driver Search Results | Cabzii",
  description: "Compare acting driver packages on Cabzii.",
  path: "/drivers/results",
  noindex: true
});

export default function DriverResultsLayout({ children }) {
  return children;
}
