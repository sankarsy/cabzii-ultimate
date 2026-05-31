import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";
import { buildPageMetadata } from "../../lib/seo/constants";

export const metadata = buildPageMetadata({
  title: "Travel Blog — Cabs, Pilgrimage & Holiday Tips",
  description: "Guides on cab booking, pilgrimage packages, airport transfers and holiday planning on cabzii.in.",
  path: "/blogs",
  keywords: ["cab booking tips", "Tirupati travel guide", "pilgrimage blog India", "cabzii blog"]
});

export default function BlogsLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
