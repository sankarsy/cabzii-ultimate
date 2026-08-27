import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Booking Online — AC Seater & Sleeper Tickets | Cabzii",
  description:
    "Intercity bus tickets on Cabzii.in. This page is a booking tool, not a Cabzii SEO landing.",
  path: "/buses",
  noindex: true,
  follow: true
});

export default function BusesLayout({ children }) {
  return children;
}
