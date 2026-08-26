import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import { FEATURED_ROUTE_SLUGS } from "../../lib/seo/featuredRoutes";
import { SEO_ROUTES } from "../../lib/seo/routes";
import { formatRouteLabel } from "../../lib/seo/internalLinks";

export default function RoutesHubSeo() {
  const featured = FEATURED_ROUTE_SLUGS.map((slug) => SEO_ROUTES.find((r) => r.slug === slug)).filter(Boolean);

  return (
    <article className="section-shell cabzii-seo-landing pb-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Routes", path: "/routes" }
        ]}
      />
      <p className="cabzii-seo-kicker">One-way &amp; outstation corridors</p>
      <h1>Popular cab routes</h1>
      <p className="cabzii-seo-lead">
        These are high-value routes with distance, fare context and booking CTAs. Cabzii does not auto-index every
        origin–destination pair.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {featured.map((route) => (
          <li key={route.slug}>
            <Link
              href={`/routes/${route.slug}`}
              className="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300"
            >
              {formatRouteLabel(route)}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/cabs" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
          Search any route on cab booking →
        </Link>
      </p>
    </article>
  );
}
