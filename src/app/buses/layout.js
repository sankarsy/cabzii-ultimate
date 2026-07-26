import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Booking Online — AC Seater & Sleeper Tickets | Cabzii",
  description:
    "Book intercity bus tickets on Cabzii.in — compare operators, pick boarding & drop points, select seater or sleeper berth, and get instant confirmation across South India.",
  path: "/buses",
  keywords: [
    "bus booking online",
    "AC sleeper bus tickets",
    "Chennai to Bangalore bus",
    "intercity bus booking India",
    "bus seat selection"
  ]
});

export default function BusesLayout({ children }) {
  return children;
}
