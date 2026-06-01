import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "My Account | Cabzii",
  description: "Manage your Cabzii account and bookings.",
  path: "/account",
  noindex: true
});

export default function AccountLayout({ children }) {
  return children;
}
