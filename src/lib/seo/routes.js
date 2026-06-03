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

/** @deprecated Use tunedRouteTitle / tunedRouteDescription from metadataTuning */
export function routeTitle(fromCity, toCity) {
  return `One Way Cab ${fromCity.name} to ${toCity.name} | Fixed Fare | Cabzii`;
}

/** @deprecated Use tunedRouteDescription from metadataTuning */
export function routeDescription(fromCity, toCity, route) {
  return `Book one way cab from ${fromCity.name} to ${toCity.name} (${route.distance}, ${route.duration}). Sedan, SUV & Innova with upfront fare on Cabzii.`;
}
