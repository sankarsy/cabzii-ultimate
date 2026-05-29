import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Book Cabs & Taxis Online",
  description:
    "Browse sedan, SUV, van and bus options with transparent fares. Outstation, airport and local cab booking on Cabzii (cabzii.in).",
  path: "/cabs",
  keywords: ["cab booking", "taxi online", "outstation cab", "airport cab", "cabzii cabs"]
});

export default function CabsLayout({ children }) {
  return children;
}
