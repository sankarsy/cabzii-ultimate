import { cityBySlug } from "./cities";
import { buildExpandedRoutes, lookupRouteTripData } from "./routeCatalog";
import { FEATURED_ROUTE_SLUGS, ROUTE_CITY_SLUG_ALIASES } from "./featuredRoutes";

/** Hand-tuned priority routes — fares verified; override generated estimates. */
const MANUAL_ROUTES = [
  {
    slug: "chennai-to-bangalore-cab",
    from: "chennai",
    to: "bengaluru",
    distance: "350 km",
    duration: "6–7 hours",
    sedanFrom: 5499,
    suvFrom: 7499
  },
  {
    slug: "chennai-to-pondicherry-cab",
    from: "chennai",
    to: "pondicherry",
    distance: "160 km",
    duration: "3–4 hours",
    sedanFrom: 2899,
    suvFrom: 3799
  },
  {
    slug: "chennai-to-tirupati-cab",
    from: "chennai",
    to: "tirupati",
    distance: "135 km",
    duration: "3–4 hours",
    sedanFrom: 3299,
    suvFrom: 4299
  },
  {
    slug: "chennai-to-coimbatore-cab",
    from: "chennai",
    to: "coimbatore",
    distance: "505 km",
    duration: "8–9 hours",
    sedanFrom: 7499,
    suvFrom: 9999
  },
  {
    slug: "chennai-to-madurai-cab",
    from: "chennai",
    to: "madurai",
    distance: "460 km",
    duration: "7–8 hours",
    sedanFrom: 6999,
    suvFrom: 9299
  },
  {
    slug: "bengaluru-to-mysore-cab",
    from: "bengaluru",
    to: "mysore",
    distance: "145 km",
    duration: "3–4 hours",
    sedanFrom: 2499,
    suvFrom: 3499
  },
  {
    slug: "bengaluru-to-chennai-cab",
    from: "bengaluru",
    to: "chennai",
    distance: "350 km",
    duration: "6–7 hours",
    sedanFrom: 5499,
    suvFrom: 7499
  },
  {
    slug: "bengaluru-to-hyderabad-cab",
    from: "bengaluru",
    to: "hyderabad",
    distance: "575 km",
    duration: "9–10 hours",
    sedanFrom: 8499,
    suvFrom: 10999
  },
  {
    slug: "hyderabad-to-bengaluru-cab",
    from: "hyderabad",
    to: "bengaluru",
    distance: "575 km",
    duration: "9–10 hours",
    sedanFrom: 8499,
    suvFrom: 10999
  },
  {
    slug: "coimbatore-to-bengaluru-cab",
    from: "coimbatore",
    to: "bengaluru",
    distance: "365 km",
    duration: "6–7 hours",
    sedanFrom: 4800,
    suvFrom: 6800
  },
  {
    slug: "chennai-to-vellore-cab",
    from: "chennai",
    to: "vellore",
    distance: "140 km",
    duration: "3 hours",
    sedanFrom: 2600,
    suvFrom: 3600
  },
  {
    slug: "chennai-to-hosur-cab",
    from: "chennai",
    to: "hosur",
    distance: "320 km",
    duration: "5–6 hours",
    sedanFrom: 4200,
    suvFrom: 5800
  },
  {
    slug: "chennai-to-trichy-cab",
    from: "chennai",
    to: "trichy",
    distance: "330 km",
    duration: "5–6 hours",
    sedanFrom: 4200,
    suvFrom: 5800
  },
  {
    slug: "chennai-to-salem-cab",
    from: "chennai",
    to: "salem",
    distance: "340 km",
    duration: "5–6 hours",
    sedanFrom: 4300,
    suvFrom: 5900
  },
  {
    slug: "chennai-to-erode-cab",
    from: "chennai",
    to: "erode",
    distance: "400 km",
    duration: "6–7 hours",
    sedanFrom: 4800,
    suvFrom: 6600
  },
  {
    slug: "chennai-to-tirunelveli-cab",
    from: "chennai",
    to: "tirunelveli",
    distance: "625 km",
    duration: "9–10 hours",
    sedanFrom: 7800,
    suvFrom: 9800
  },
  {
    slug: "chennai-to-kochi-cab",
    from: "chennai",
    to: "kochi",
    distance: "690 km",
    duration: "10–11 hours",
    sedanFrom: 8500,
    suvFrom: 10500
  },
  {
    slug: "coimbatore-to-madurai-cab",
    from: "coimbatore",
    to: "madurai",
    distance: "215 km",
    duration: "4–5 hours",
    sedanFrom: 3200,
    suvFrom: 4400
  },
  {
    slug: "coimbatore-to-kodaikanal-cab",
    from: "coimbatore",
    to: "kodaikanal",
    distance: "170 km",
    duration: "4–5 hours",
    sedanFrom: 3500,
    suvFrom: 4800
  },
  {
    slug: "madurai-to-kodaikanal-cab",
    from: "madurai",
    to: "kodaikanal",
    distance: "120 km",
    duration: "3–4 hours",
    sedanFrom: 2800,
    suvFrom: 3800
  },
  {
    slug: "coimbatore-to-pondicherry-cab",
    from: "coimbatore",
    to: "pondicherry",
    distance: "380 km",
    duration: "6–7 hours",
    sedanFrom: 5000,
    suvFrom: 6800
  },
  {
    slug: "coimbatore-to-tirupati-cab",
    from: "coimbatore",
    to: "tirupati",
    distance: "420 km",
    duration: "7–8 hours",
    sedanFrom: 5500,
    suvFrom: 7200
  },
  {
    slug: "madurai-to-chennai-cab",
    from: "madurai",
    to: "chennai",
    distance: "460 km",
    duration: "7–8 hours",
    sedanFrom: 6000,
    suvFrom: 8000
  },
  {
    slug: "madurai-to-trichy-cab",
    from: "madurai",
    to: "trichy",
    distance: "135 km",
    duration: "2–3 hours",
    sedanFrom: 2200,
    suvFrom: 3200
  },
  {
    slug: "madurai-to-tirunelveli-cab",
    from: "madurai",
    to: "tirunelveli",
    distance: "160 km",
    duration: "3 hours",
    sedanFrom: 2600,
    suvFrom: 3600
  },
  {
    slug: "bengaluru-to-coimbatore-cab",
    from: "bengaluru",
    to: "coimbatore",
    distance: "365 km",
    duration: "6–7 hours",
    sedanFrom: 4800,
    suvFrom: 6800
  },
  {
    slug: "bengaluru-to-pondicherry-cab",
    from: "bengaluru",
    to: "pondicherry",
    distance: "310 km",
    duration: "5–6 hours",
    sedanFrom: 4200,
    suvFrom: 5800
  },
  {
    slug: "bengaluru-to-tirupati-cab",
    from: "bengaluru",
    to: "tirupati",
    distance: "255 km",
    duration: "4–5 hours",
    sedanFrom: 3500,
    suvFrom: 4800
  },
  {
    slug: "hyderabad-to-chennai-cab",
    from: "hyderabad",
    to: "chennai",
    distance: "625 km",
    duration: "10–11 hours",
    sedanFrom: 8200,
    suvFrom: 10200
  },
  {
    slug: "hyderabad-to-tirupati-cab",
    from: "hyderabad",
    to: "tirupati",
    distance: "560 km",
    duration: "8–9 hours",
    sedanFrom: 7200,
    suvFrom: 9200
  },
  {
    slug: "pondicherry-to-chennai-cab",
    from: "pondicherry",
    to: "chennai",
    distance: "160 km",
    duration: "3–4 hours",
    sedanFrom: 2800,
    suvFrom: 3800
  },
  {
    slug: "tirupati-to-chennai-cab",
    from: "tirupati",
    to: "chennai",
    distance: "135 km",
    duration: "3–4 hours",
    sedanFrom: 3200,
    suvFrom: 4200
  },
  {
    slug: "trichy-to-chennai-cab",
    from: "trichy",
    to: "chennai",
    distance: "330 km",
    duration: "5–6 hours",
    sedanFrom: 4200,
    suvFrom: 5800
  },
  {
    slug: "salem-to-chennai-cab",
    from: "salem",
    to: "chennai",
    distance: "340 km",
    duration: "5–6 hours",
    sedanFrom: 4300,
    suvFrom: 5900
  },
  {
    slug: "vellore-to-chennai-cab",
    from: "vellore",
    to: "chennai",
    distance: "140 km",
    duration: "3 hours",
    sedanFrom: 2600,
    suvFrom: 3600
  },
  {
    slug: "hosur-to-bengaluru-cab",
    from: "hosur",
    to: "bengaluru",
    distance: "40 km",
    duration: "1 hour",
    sedanFrom: 1200,
    suvFrom: 1800
  },
  {
    slug: "chennai-to-visakhapatnam-cab",
    from: "chennai",
    to: "visakhapatnam",
    distance: "800 km",
    duration: "12–13 hours",
    sedanFrom: 9800,
    suvFrom: 11800
  },
  {
    slug: "chennai-to-rameswaram-cab",
    from: "chennai",
    to: "rameswaram",
    distance: "560 km",
    duration: "8–9 hours",
    sedanFrom: 8499,
    suvFrom: 10999
  },
  {
    slug: "madurai-to-rameswaram-cab",
    from: "madurai",
    to: "rameswaram",
    distance: "170 km",
    duration: "3–4 hours",
    sedanFrom: 2800,
    suvFrom: 3800
  },
  {
    slug: "coimbatore-to-ooty-cab",
    from: "coimbatore",
    to: "ooty",
    distance: "85 km",
    duration: "3 hours",
    sedanFrom: 2200,
    suvFrom: 3200
  },
  {
    slug: "chennai-to-ooty-cab",
    from: "chennai",
    to: "ooty",
    distance: "555 km",
    duration: "9–10 hours",
    sedanFrom: 6800,
    suvFrom: 8800
  },
  {
    slug: "trichy-to-tirupati-cab",
    from: "trichy",
    to: "tirupati",
    distance: "380 km",
    duration: "6–7 hours",
    sedanFrom: 5000,
    suvFrom: 6800
  },
  {
    slug: "madurai-to-tirupati-cab",
    from: "madurai",
    to: "tirupati",
    distance: "500 km",
    duration: "8–9 hours",
    sedanFrom: 6400,
    suvFrom: 8400
  },
  {
    slug: "salem-to-tirupati-cab",
    from: "salem",
    to: "tirupati",
    distance: "280 km",
    duration: "5–6 hours",
    sedanFrom: 3800,
    suvFrom: 5200
  },
  {
    slug: "vellore-to-tirupati-cab",
    from: "vellore",
    to: "tirupati",
    distance: "140 km",
    duration: "3 hours",
    sedanFrom: 2600,
    suvFrom: 3600
  },
  {
    slug: "pondicherry-to-tirupati-cab",
    from: "pondicherry",
    to: "tirupati",
    distance: "210 km",
    duration: "4–5 hours",
    sedanFrom: 3200,
    suvFrom: 4400
  },
  {
    slug: "kanchipuram-to-tirupati-cab",
    from: "kanchipuram",
    to: "tirupati",
    distance: "120 km",
    duration: "2–3 hours",
    sedanFrom: 2400,
    suvFrom: 3400
  }
];

/** 100+ one-way route pages at /routes/{slug} — manual overrides + programmatic mesh. */
export const SEO_ROUTES = buildExpandedRoutes(MANUAL_ROUTES);

export function normalizeRouteCitySlug(raw) {
  const key = String(raw || "").toLowerCase();
  return ROUTE_CITY_SLUG_ALIASES[key] || key;
}

/** Parse `/routes/{from}-to-{to}-cab` slugs. */
export function parseRouteSlug(slug) {
  const match = String(slug || "").match(/^([a-z0-9-]+)-to-([a-z0-9-]+)-cab$/i);
  if (!match) return null;
  const from = normalizeRouteCitySlug(match[1]);
  const to = normalizeRouteCitySlug(match[2]);
  if (!from || !to || from === to) return null;
  return { from, to, slug: `${from}-to-${to}-cab` };
}

/** Build a route page object when slug is valid but not in the static mesh (SSR fallback). */
export function synthesizeRouteFromSlug(slug) {
  const parsed = parseRouteSlug(slug);
  if (!parsed) return null;

  const fromCity = cityBySlug(parsed.from);
  const toCity = cityBySlug(parsed.to);
  if (!fromCity || !toCity) return null;

  const existing = SEO_ROUTES.find((r) => r.slug === parsed.slug);
  if (existing) {
    return { ...existing, fromCity, toCity, source: "static" };
  }

  const trip = lookupRouteTripData(parsed.from, parsed.to);
  return {
    slug: parsed.slug,
    from: parsed.from,
    to: parsed.to,
    fromCity,
    toCity,
    distance: `${trip.km} km`,
    duration: trip.duration,
    sedanFrom: trip.sedan,
    suvFrom: trip.suv,
    source: "synthesized"
  };
}

export function routeBySlug(slug) {
  const synthesized = synthesizeRouteFromSlug(slug);
  if (!synthesized) return null;
  return synthesized;
}

/** Featured corridors only — do not pre-render the full city mesh (ISR / crawl cost). */
export function allRouteSlugsForBuild() {
  return [...FEATURED_ROUTE_SLUGS];
}

export function routesForCity(citySlug) {
  const seen = new Set();
  const out = [];
  for (const r of SEO_ROUTES) {
    if (r.from !== citySlug && r.to !== citySlug) continue;
    const key = `${r.from}|${r.to}`;
    if (seen.has(key)) continue;
    const resolved = routeBySlug(r.slug);
    if (!resolved) continue;
    seen.add(key);
    out.push(resolved);
  }
  return out;
}

