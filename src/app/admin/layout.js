import { buildPageMetadata } from "../../lib/seo";

/* Admin is a client-side dashboard (useSearchParams, auth token) —
   never prerender it; render at request time instead. */
export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Cabzii administration.",
  path: "/admin",
  noindex: true
});

export default function AdminLayout({ children }) {
  return children;
}
