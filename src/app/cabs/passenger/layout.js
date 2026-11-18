import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Review booking | Cabzii",
  description: "Review your cab, inclusions, traveller details and confirm on Cabzii.",
  path: "/cabs/passenger",
  noindex: true
});

export default function CabPassengerLayout({ children }) {
  return children;
}
