import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Cabzii administration.",
  path: "/admin",
  noindex: true
});

export default function AdminLayout({ children }) {
  return children;
}
