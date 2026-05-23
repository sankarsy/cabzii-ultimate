import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Secure Payment",
  description: "Complete your Cabzii cab, driver or tour booking.",
  path: "/payment",
  noindex: true
});

export default function PaymentLayout({ children }) {
  return children;
}
