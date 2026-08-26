import { SEO_CITIES, cityBySlug } from "./cities";
import { SEO_ROUTES, routesForCity } from "./routes";
import { SEO_SERVICES, servicePath } from "./services";
import { cityHasCommercialAirport } from "./airports";

/** Primary catalog pages — always link from hub sections. */
export const CORE_INTERNAL_LINKS = [
  { href: "/cabs", label: "Book a cab", desc: "Sedan, SUV, Innova & more" },
  { href: "/holidays", label: "Holiday packages", desc: "Pilgrimage, beach & hill trips" },
  { href: "/holidays?category=pilgrimage", label: "Pilgrimage tours", desc: "Tirupati, Rameswaram, Shirdi & more" },
  { href: "/call-driver", label: "Call Driver", desc: "Acting driver for your own car" },
  { href: "/acting-driver", label: "Acting driver cities", desc: "City chauffeur-on-hire pages" },
  { href: "/cabs", label: "Local & outstation cabs", desc: "Transparent fares online" },
  { href: "/locations", label: "Service locations", desc: "Pickup points by city" },
  { href: "/blogs", label: "Travel blog", desc: "Tips & route guides" }
];

/** Cities used for cab, acting-driver and multi-city service internal links — Chennai/TN first. */
export const INTERNAL_LINK_CITIES = [
  "chennai",
  "coimbatore",
  "madurai",
  "trichy",
  "salem",
  "vellore",
  "erode",
  "hosur",
  "pondicherry",
  "tirupati",
  "bengaluru",
  "ooty",
  "kanchipuram",
  "thanjavur",
  "kanyakumari",
  "thoothukudi",
  "tiruvannamalai"
];

/** Top cities for service landing cross-links (SEO). */
export const SERVICE_LINK_CITIES = [
  "chennai",
  "coimbatore",
  "madurai",
  "trichy",
  "salem",
  "bengaluru"
];

function citiesBySlugs(slugs) {
  return slugs.map((slug) => SEO_CITIES.find((c) => c.slug === slug)).filter(Boolean);
}

export function formatRouteLabel(route) {
  return route.slug
    .replace(/-/g, " ")
    .replace(/\bcab\b$/i, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function cabBookingLinks(limit = INTERNAL_LINK_CITIES.length) {
  return citiesBySlugs(INTERNAL_LINK_CITIES)
    .slice(0, limit)
    .map((city) => ({
      href: `/cab-booking/${city.slug}`,
      label: `Cab booking ${city.name}`,
      city: city.name
    }));
}

export function actingDriverLinks(limit = INTERNAL_LINK_CITIES.length) {
  return citiesBySlugs(INTERNAL_LINK_CITIES)
    .slice(0, limit)
    .map((city) => ({
      href: `/acting-driver/${city.slug}`,
      label: `Acting driver ${city.name}`,
      city: city.name
    }));
}

/** All services for one city. */
export function serviceLinks(citySlug = "chennai", limit = SEO_SERVICES.length) {
  const city = SEO_CITIES.find((c) => c.slug === citySlug) || SEO_CITIES[0];
  return SEO_SERVICES.slice(0, limit).map((svc) => ({
    href: servicePath(svc, city),
    label: `${svc.name} ${city.name}`,
    service: svc.name,
    city: city.name
  }));
}

/** Services across multiple cities — strong internal linking for programmatic SEO pages. */
export function serviceLinksForCities(
  citySlugs = SERVICE_LINK_CITIES,
  { servicesPerCity = SEO_SERVICES.length } = {}
) {
  const cities = citiesBySlugs(citySlugs);
  const services = SEO_SERVICES.slice(0, servicesPerCity);
  const links = [];

  for (const city of cities) {
    for (const svc of services) {
      links.push({
        href: servicePath(svc, city),
        label: `${svc.name} ${city.name}`,
        service: svc.name,
        city: city.name
      });
    }
  }

  return links;
}

export function routeLinks(limit = SEO_ROUTES.length) {
  return SEO_ROUTES.slice(0, limit).map((route) => ({
    href: `/routes/${route.slug}`,
    label: formatRouteLabel(route)
  }));
}

export function routeLinksForCity(citySlug, limit = 6) {
  const seen = new Set();
  const out = [];
  for (const route of routesForCity(citySlug)) {
    if (!route?.slug || seen.has(route.slug)) continue;
    seen.add(route.slug);
    out.push({
      href: `/routes/${route.slug}`,
      label: formatRouteLabel(route)
    });
    if (out.length >= limit) break;
  }
  return out;
}

function resolveLinkCity(citySlug) {
  if (citySlug) {
    const match = cityBySlug(citySlug);
    if (match) return match;
  }
  return SEO_CITIES.find((c) => c.slug === "chennai") || SEO_CITIES[0];
}

function cityServiceLink(city, slug, label) {
  const svc = SEO_SERVICES.find((s) => s.slug === slug);
  if (!svc) return null;
  return {
    href: servicePath(svc, city),
    label: `${label} ${city.name}`
  };
}

/**
 * Related links for a page. Pass citySlug on city hubs so Vellore/Trichy
 * never fall back to Chennai commercial URLs.
 */
export function relatedLinksForPage(page, citySlug = "") {
  const city = resolveLinkCity(citySlug);
  const sameCity = Boolean(citySlug);
  const base = [
    { href: "/", label: "Home" },
    { href: "/cabs", label: "All cabs" },
    { href: "/holidays", label: "Holiday packages" },
    { href: "/call-driver", label: "Call Driver" },
    { href: "/acting-driver", label: "Acting driver" }
  ];

  const airportLabel = cityHasCommercialAirport(city.slug)
    ? `Airport taxi ${city.name}`
    : `Airport transfer from ${city.name}`;

  if (page === "cabs") {
    return [
      ...base,
      { href: `/cab-booking/${city.slug}`, label: `Cab booking ${city.name}` },
      cityServiceLink(city, "outstation-cab", "Outstation cab"),
      { href: `/services/airport-taxi/${city.slug}`, label: airportLabel },
      cityServiceLink(city, "one-way-cab", "One way cab"),
      cityServiceLink(city, "car-rental", "Car rental"),
      cityServiceLink(city, "cab-rental", "Cab rental"),
      { href: `/acting-driver/${city.slug}`, label: `Acting driver ${city.name}` },
      ...(sameCity ? routeLinksForCity(city.slug, 6) : routeLinks(6))
    ].filter(Boolean);
  }
  if (page === "packages") {
    return [
      ...base,
      { href: `/services/tour-packages/${city.slug}`, label: `Holiday packages ${city.name}` },
      { href: `/cab-booking/${city.slug}`, label: `Cab to tour pickup — ${city.name}` },
      ...cabBookingLinks(6),
      ...routeLinks(4)
    ];
  }
  if (page === "drivers") {
    return [
      ...base,
      { href: `/acting-driver/${city.slug}`, label: `Acting driver ${city.name}` },
      cityServiceLink(city, "driver-on-hire", "Driver on hire"),
      cityServiceLink(city, "chauffeur-service", "Chauffeur service"),
      ...(sameCity ? actingDriverLinks(8).filter((l) => !l.href.endsWith(`/${city.slug}`)).slice(0, 8) : actingDriverLinks(8)),
      ...serviceLinks(city.slug, 4)
    ].filter(Boolean);
  }
  return base;
}

export function detectCitySlugFromText(...parts) {
  const blob = parts.filter(Boolean).join(" ").toLowerCase();
  const ranked = [...SEO_CITIES].sort((a, b) => b.name.length - a.name.length);
  for (const city of ranked) {
    if (blob.includes(city.slug) || blob.includes(city.name.toLowerCase())) return city.slug;
  }
  if (/\bbangalore\b/.test(blob)) return "bengaluru";
  return "";
}
