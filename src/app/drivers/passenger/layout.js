import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Passenger details | Cabzii",
  description: "Enter traveller details to complete your acting driver booking on Cabzii.",
  path: "/drivers/passenger",
  noindex: true
});

export default function DriverPassengerLayout({ children }) {
  return children;
}
