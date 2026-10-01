import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "../../../components/seo/JsonLd";
import Breadcrumbs from "../../../components/seo/Breadcrumbs";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  FEATURED_ROUTE_SLUGS,
  SEO_ROUTES
} from "../../../lib/seo";
import { cityBySlug } from "../../../lib/seo/cities";
import { cityCabLandingPath } from "../../../lib/cityCabPaths";
import { formatRouteLabel } from "../../../lib/seo/internalLinks";
import { outstationHubPath, parseLegacyRouteSlug, routePublicPath } from "../../../lib/seo/outstationPaths";
import { classifyCityHub } from "../../../lib/seo/indexation";
import { SEO_REVALIDATE_SECONDS } from "../../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;
export const dynamicParams = true;

function featuredFromCity(citySlug) {
  return FEATURED_ROUTE_SLUGS.map((slug) => {
    const parsed = parseLegacyRouteSlug(slug);
    const row = SEO_ROUTES.find((r) => r.slug === slug);
    if (!parsed || !row) return null;
    if (parsed.fromToken !== citySlug && row.from !== citySlug) return null;
    return row;
  }).filter(Boolean);
}

export function generateStaticParams() {
  const cities = new Set();
  for (const slug of FEATURED_ROUTE_SLUGS) {
    const parsed = parseLegacyRouteSlug(slug);
    if (parsed) cities.add(parsed.fromToken);
  }
  return [...cities].map((city) => ({ city }));
}

export async function generateMetadata({ params }) {
  const city = cityBySlug(params.city);
  if (!city) {
    return buildPageMetadata({
      title: "Outstation cabs",
      description: "Outstation cab routes on Cabzii.",
      path: outstationHubPath(params.city),
      noindex: true,
      follow: false
    });
  }
  const policy = classifyCityHub(city.slug, "cab-booking");
  return buildPageMetadata({
    title: `${city.name} Outstation Cab Routes | Cabzii`,
    description: `Book outstation cabs from ${city.name}. One-way and return trips with fares shown before you pay.`,
    path: outstationHubPath(city.slug),
    keywords: [`${city.name.toLowerCase()} outstation cab`, `outstation taxi ${city.name.toLowerCase()}`],
    noindex: !policy.indexable,
    follow: policy.follow
  });
}

export default function OutstationCityHubPage({ params }) {
  const city = cityBySlug(params.city);
  if (!city) notFound();

  const routes = featuredFromCity(city.slug);
  const path = outstationHubPath(city.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: city.name, path: cityCabLandingPath(city.slug) },
          { name: "Outstation", path }
        ])}
      />
      <article className="section-shell cabzii-seo-landing pb-10">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: city.name, path: cityCabLandingPath(city.slug) },
            { name: "Outstation", path }
          ]}
        />
        <p className="cabzii-seo-kicker">Outstation · {city.name}</p>
        <h1>{city.name} outstation cab routes</h1>
        <p className="cabzii-seo-lead">
          One-way and return cabs from {city.name}. Fares are shown on each route before you pay. Tolls are extra unless
          listed.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {routes.map((route) => (
            <li key={route.slug}>
              <Link
                href={routePublicPath(route.slug)}
                className="block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300"
              >
                {formatRouteLabel(route)}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href={cityCabLandingPath(city.slug)} className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            Cab booking {city.name}
          </Link>
          {" · "}
          <Link href="/routes" className="font-semibold text-[var(--cabzii-brand)] hover:underline">
            All featured routes
          </Link>
        </p>
      </article>
    </>
  );
}
