import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Passenger details | Cabzii",
  description: "Enter traveller details to complete your cab booking on Cabzii.",
  path: "/cabs/passenger",
  noindex: true
});

export default function CabPassengerLayout({ children }) {
  return children;
}
