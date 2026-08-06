import { buildPageMetadata } from "../../lib/seo";
import TravelLayoutClient from "../../components/mmt/TravelLayoutClient";

export const metadata = buildPageMetadata({
  title: "Payment | Cabzii",
  description: "Complete your Cabzii booking payment securely.",
  path: "/payment",
  noindex: true
});

export default function PaymentLayout({ children }) {
  return <TravelLayoutClient>{children}</TravelLayoutClient>;
}
