import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Booking — Coming Soon | Cabzii",
  description: "Intercity bus booking on cabzii.in is coming soon. Book cabs and tempo travellers today.",
  path: "/buses",
  noindex: true
});

export default function BusesLayout({ children }) {
  return children;
}
