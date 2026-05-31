import { SEO_CITIES } from "./cities";
import { SEO_ROUTES } from "./routes";
import { SEO_SERVICES, servicePath } from "./services";

/** Primary catalog pages — always link from hub sections. */
export const CORE_INTERNAL_LINKS = [
  { href: "/cabs", label: "Book a cab", desc: "Sedan, SUV, Innova & more" },
  { href: "/holidays", label: "Holiday packages", desc: "Pilgrimage, beach & hill trips" },
  { href: "/holidays?category=pilgrimage", label: "Pilgrimage tours", desc: "Tirupati, Rameswaram, Shirdi & more" },
  { href: "/drivers", label: "Hire a driver", desc: "Acting & chauffeur drivers" },
  { href: "/search?q=offers", label: "Offers & deals", desc: "Discounted fares" },
  { href: "/locations", label: "Service locations", desc: "Pickup points by city" },
  { href: "/blogs", label: "Travel blog", desc: "Tips & route guides" }
];

/** Cities used for cab, acting-driver and multi-city service internal links. */
export const INTERNAL_LINK_CITIES = [
  "chennai",
  "bengaluru",
  "hyderabad",
  "coimbatore",
  "madurai",
  "mysore",
  "tirupati",
  "salem",
  "trichy",
  "pondicherry",
  "vellore",
  "hosur"
];

/** Top cities for service landing cross-links (SEO). */
export const SERVICE_LINK_CITIES = ["chennai", "bengaluru", "hyderabad", "coimbatore", "madurai"];

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

export function relatedLinksForPage(page) {
  const chennai = SEO_CITIES.find((c) => c.slug === "chennai") || SEO_CITIES[0];
  const base = [
    { href: "/", label: "Home" },
    { href: "/cabs", label: "All cabs" },
    { href: "/holidays", label: "Holiday packages" },
    { href: "/drivers", label: "Drivers" }
  ];

  if (page === "cabs") {
    return [
      ...base,
      { href: `/cab-booking/chennai`, label: "Cab booking Chennai" },
      { href: `/services/outstation-cab/${chennai.slug}`, label: "Outstation cab Chennai" },
      { href: `/services/airport-taxi/${chennai.slug}`, label: "Airport taxi Chennai" },
      { href: `/services/one-way-cab/${chennai.slug}`, label: "One way cab Chennai" },
      ...actingDriverLinks(4),
      ...routeLinks(6)
    ];
  }
  if (page === "packages") {
    return [
      ...base,
      { href: `/services/holiday-packages/${chennai.slug}`, label: "Holiday packages Chennai" },
      { href: `/cab-booking/chennai`, label: "Cab to tour pickup" },
      ...cabBookingLinks(6),
      ...routeLinks(4)
    ];
  }
  if (page === "drivers") {
    return [
      ...base,
      { href: `/acting-driver/chennai`, label: "Acting driver Chennai" },
      { href: `/services/driver-on-hire/${chennai.slug}`, label: "Driver on hire Chennai" },
      { href: `/services/chauffeur-service/${chennai.slug}`, label: "Chauffeur service Chennai" },
      ...actingDriverLinks(8),
      ...serviceLinks("bengaluru", 4)
    ];
  }
  return base;
}
