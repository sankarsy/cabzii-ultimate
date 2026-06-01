import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Train Booking — Coming Soon | Cabzii",
  description: "Train booking on cabzii.in is coming soon. Book cabs and outstation taxis for your trip.",
  path: "/trains",
  noindex: true
});

export default function TrainsLayout({ children }) {
  return children;
}
