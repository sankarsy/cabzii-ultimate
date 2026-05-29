import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Search Cabs, Acting Drivers & Tours",
  description: "Search cabzii.in for cabs, acting drivers, tour packages and travel guides across Indian cities.",
  path: "/search",
  noindex: true
});

export default function SearchLayout({ children }) {
  return children;
}
