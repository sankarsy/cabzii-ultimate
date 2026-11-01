import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Tickets Online — AC Seater & Sleeper | Cabzii",
  description:
    "Search intercity bus tickets from Chennai and South India on Cabzii. Compare AC seater and sleeper, pick seats and boarding, then confirm. Fares shown before you pay.",
  path: "/buses",
  keywords: ["bus booking", "bus tickets online", "chennai bus", "ac sleeper", "cabzii buses"]
});

export default function BusesLayout({ children }) {
  return children;
}
