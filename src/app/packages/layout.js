import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Tour Packages & Holiday Cabs",
  description:
    "Curated tour packages with premium transport. Book hill stations, heritage and weekend getaways on Cabzii.",
  path: "/packages",
  keywords: ["tour packages", "holiday cab", "travel package India", "cabzii tours"]
});

export default function PackagesLayout({ children }) {
  return children;
}
