import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Select Bus Seats — Seater & Sleeper Berth | Cabzii",
  description: "Choose your bus seats or sleeper berths and boarding/dropping points before checkout on Cabzii.in.",
  path: "/buses/seats",
  noindex: true
});

export default function BusSeatsLayout({ children }) {
  return children;
}
