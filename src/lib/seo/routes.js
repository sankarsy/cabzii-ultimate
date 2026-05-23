import { cityBySlug } from "./cities";

/** One-way / outstation route landing pages at /routes/{slug}. */
export const SEO_ROUTES = [
  {
    slug: "chennai-to-bangalore-cab",
    from: "chennai",
    to: "bengaluru",
    distance: "350 km",
    duration: "6–7 hours",
    sedanFrom: 4500,
    suvFrom: 6500
  },
  {
    slug: "chennai-to-pondicherry-cab",
    from: "chennai",
    to: "pondicherry",
    distance: "160 km",
    duration: "3–4 hours",
    sedanFrom: 2800,
    suvFrom: 3800
  },
  {
    slug: "chennai-to-tirupati-cab",
    from: "chennai",
    to: "tirupati",
    distance: "135 km",
    duration: "3–4 hours",
    sedanFrom: 3200,
    suvFrom: 4200
  },
  {
    slug: "chennai-to-coimbatore-cab",
    from: "chennai",
    to: "coimbatore",
    distance: "505 km",
    duration: "8–9 hours",
    sedanFrom: 6500,
    suvFrom: 8500
  },
  {
    slug: "chennai-to-madurai-cab",
    from: "chennai",
    to: "madurai",
    distance: "460 km",
    duration: "7–8 hours",
    sedanFrom: 6000,
    suvFrom: 8000
  },
  {
    slug: "bengaluru-to-mysore-cab",
    from: "bengaluru",
    to: "mysore",
    distance: "145 km",
    duration: "3–4 hours",
    sedanFrom: 2500,
    suvFrom: 3500
  },
  {
    slug: "bengaluru-to-chennai-cab",
    from: "bengaluru",
    to: "chennai",
    distance: "350 km",
    duration: "6–7 hours",
    sedanFrom: 4500,
    suvFrom: 6500
  },
  {
    slug: "bengaluru-to-hyderabad-cab",
    from: "bengaluru",
    to: "hyderabad",
    distance: "575 km",
    duration: "9–10 hours",
    sedanFrom: 7500,
    suvFrom: 9500
  },
  {
    slug: "hyderabad-to-bengaluru-cab",
    from: "hyderabad",
    to: "bengaluru",
    distance: "575 km",
    duration: "9–10 hours",
    sedanFrom: 7500,
    suvFrom: 9500
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
  }
];

export function routeBySlug(slug) {
  const route = SEO_ROUTES.find((r) => r.slug === slug);
  if (!route) return null;
  const fromCity = cityBySlug(route.from);
  const toCity = cityBySlug(route.to);
  if (!fromCity || !toCity) return null;
  return { ...route, fromCity, toCity };
}

export function routesForCity(citySlug) {
  return SEO_ROUTES.filter((r) => r.from === citySlug || r.to === citySlug)
    .map((r) => routeBySlug(r.slug))
    .filter(Boolean);
}

export function routeTitle(fromCity, toCity) {
  return `One Way Cab ${fromCity.name} to ${toCity.name} | Fixed Fare | Cabzii`;
}

export function routeDescription(fromCity, toCity, route) {
  return `Book one way cab from ${fromCity.name} to ${toCity.name} (${route.distance}, ${route.duration}). Sedan, SUV & Innova with upfront fare on Cabzii.`;
}
