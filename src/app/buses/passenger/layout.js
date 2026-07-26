import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Bus Passenger Details | Cabzii",
  description: "Enter passenger contact details for your bus ticket booking on Cabzii.in.",
  path: "/buses/passenger",
  noindex: true
});

export default function BusPassengerLayout({ children }) {
  return children;
}
