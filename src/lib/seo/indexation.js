/**
 * Phase 1 indexation + internal commercial scoring.
 *
 * Scores are Cabzii business-priority estimates — not Google volumes or rankings.
 * Existing URLs are never deleted. Weak pages stay live with noindex,follow.
 */

import { FEATURED_ROUTE_SLUGS } from "./featuredRoutes";
import { isMainPageCity, isPrimaryFocusCity, isTamilNaduCity, SEO_CITIES } from "./cities";
import { SEO_SERVICES } from "./services";
import { SEO_ROUTES } from "./routes";
import { cityHasCommercialAirport } from "./airports";

/** A keep index · B improve while indexed · C noindex,follow · D do not generate (unused for live URLs) */
export const SEO_CLASS = {
  A: "A",
  B: "B",
  C: "C",
  D: "D"
};

/** Cities where long-haul mesh pages are unlikely to convert (keep URL, noindex). */
export const LONG_HAUL_CITY_SLUGS = [
  "delhi",
  "mumbai",
  "pune",
  "kolkata",
  "jaipur",
  "ahmedabad",
  "chandigarh"
];

/** Holiday-package city pages that can reasonably be an origin/destination hub. */
export const TOUR_PACKAGE_ORIGIN_SLUGS = [
  "chennai",
  "bengaluru",
  "hyderabad",
  "coimbatore",
  "madurai",
  "trichy",
  "kochi",
  "goa",
  "mumbai",
  "delhi",
  "pondicherry",
  "tirupati",
  "ooty",
  "kodaikanal",
  "mysore",
  "thoothukudi",
  "rameswaram",
  "kanyakumari",
  "kanchipuram",
  "tiruvannamalai",
  "salem",
  "vellore"
];

const CORE_SERVICES = new Set([
  "airport-taxi",
  "outstation-cab",
  "one-way-cab",
  "hourly-rental",
  "local-taxi",
  "car-rental",
  "tempo-traveller"
]);

const DRIVER_OVERLAP_SERVICES = new Set(["driver-on-hire", "chauffeur-service"]);

export function parseDistanceKm(distance) {
  const n = Number(String(distance || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function policy({
  classification,
  indexable,
  commercialScore,
  priority,
  searchIntent,
  contentQuality,
  serviceAvailable,
  vendorRequired,
  reason
}) {
  const score = clampScore(commercialScore);
  return {
    classification,
    indexable: Boolean(indexable),
    follow: true,
    commercialScore: score,
    priority: priority || (score >= 90 ? "critical" : score >= 75 ? "high" : score >= 55 ? "medium" : "low"),
    searchIntent: searchIntent || "commercial",
    contentQuality: contentQuality || "mixed",
    serviceAvailable: serviceAvailable !== false,
    vendorRequired: vendorRequired !== false,
    sitemapPriority: score >= 95 ? 0.98 : score >= 88 ? 0.94 : score >= 75 ? 0.88 : score >= 60 ? 0.78 : score >= 45 ? 0.65 : 0.4,
    changeFrequency: score >= 80 ? "weekly" : "monthly",
    reason
  };
}

export function classifyCityHub(citySlug, pageType = "cab-booking") {
  const slug = String(citySlug || "");
  const isCab = pageType !== "acting-driver";
  const intent = isCab ? "cab-booking" : "acting-driver";

  if (slug === "chennai") {
    return policy({
      classification: SEO_CLASS.A,
      indexable: true,
      commercialScore: isCab ? 100 : 96,
      priority: "critical",
      searchIntent: intent,
      contentQuality: "unique",
      vendorRequired: isCab,
      reason: "HQ money page"
    });
  }

  if (!isMainPageCity(slug)) {
    return policy({
      classification: SEO_CLASS.C,
      indexable: false,
      commercialScore: 28,
      searchIntent: intent,
      contentQuality: "template",
      vendorRequired: isCab,
      reason: "Outside main operating cities — keep URL, noindex to cut crawler/ISR load"
    });
  }

  if (isTamilNaduCity(slug) || slug === "pondicherry" || slug === "tirupati") {
    return policy({
      classification: SEO_CLASS.A,
      indexable: true,
      commercialScore: isPrimaryFocusCity(slug) ? 86 : 78,
      searchIntent: intent,
      contentQuality: "local",
      vendorRequired: isCab,
      reason: "Tamil Nadu / pilgrimage corridor hub"
    });
  }

  if (isPrimaryFocusCity(slug) || ["bengaluru", "hyderabad", "kochi", "mysore"].includes(slug)) {
    return policy({
      classification: SEO_CLASS.B,
      indexable: true,
      commercialScore: 74,
      searchIntent: intent,
      contentQuality: "local",
      vendorRequired: isCab,
      reason: "South hub — keep indexed, improve unique proof of supply"
    });
  }

  return policy({
    classification: SEO_CLASS.B,
    indexable: true,
    commercialScore: cityHasCommercialAirport(slug) ? 62 : 52,
    searchIntent: intent,
    contentQuality: "template",
    vendorRequired: isCab,
    reason: "National hub kept indexed; do not noindex without GSC"
  });
}

export function classifyServiceCity(serviceSlug, citySlug) {
  const service = String(serviceSlug || "");
  const city = String(citySlug || "");

  if (!isMainPageCity(city)) {
    return policy({
      classification: SEO_CLASS.C,
      indexable: false,
      commercialScore: 24,
      searchIntent: service || "service",
      contentQuality: "template",
      vendorRequired: true,
      reason: "Outside main operating cities — keep URL, noindex"
    });
  }

  if (city === "chennai") {
    const chennaiBoost = {
      "airport-taxi": 98,
      "outstation-cab": 96,
      "one-way-cab": 95,
      "hourly-rental": 90,
      "car-rental": 88,
      "tempo-traveller": 86,
      "local-taxi": 84,
      "cab-rental": 82,
      "tour-packages": 80,
      "driver-on-hire": 70,
      "chauffeur-service": 68
    };
    return policy({
      classification: SEO_CLASS.A,
      indexable: true,
      commercialScore: chennaiBoost[service] || 80,
      searchIntent: service,
      contentQuality: "unique",
      vendorRequired: !DRIVER_OVERLAP_SERVICES.has(service) && service !== "tour-packages",
      reason: "Chennai commercial cluster"
    });
  }

  if (service === "tour-packages" && !TOUR_PACKAGE_ORIGIN_SLUGS.includes(city)) {
    return policy({
      classification: SEO_CLASS.C,
      indexable: false,
      commercialScore: 28,
      searchIntent: "tour-packages",
      contentQuality: "template",
      vendorRequired: false,
      reason: "Thin holiday-package city page — keep URL, noindex until unique itineraries exist"
    });
  }

  if (DRIVER_OVERLAP_SERVICES.has(service)) {
    return policy({
      classification: SEO_CLASS.B,
      indexable: true,
      commercialScore: city === "chennai" ? 70 : isTamilNaduCity(city) ? 58 : 48,
      searchIntent: "acting-driver-overlap",
      contentQuality: "overlap",
      vendorRequired: false,
      reason: "Overlaps acting-driver; keep indexed until GSC proves consolidation"
    });
  }

  let score = 50;
  if (CORE_SERVICES.has(service)) score += 12;
  if (service === "airport-taxi" && cityHasCommercialAirport(city)) score += 16;
  if (service === "airport-taxi" && !cityHasCommercialAirport(city) && (isTamilNaduCity(city) || isPrimaryFocusCity(city))) {
    score += 8;
  }
  if (["outstation-cab", "one-way-cab"].includes(service) && (isTamilNaduCity(city) || isPrimaryFocusCity(city))) {
    score += 14;
  }
  if (isTamilNaduCity(city) || city === "pondicherry" || city === "tirupati") score += 10;
  else if (isPrimaryFocusCity(city)) score += 6;
  else score -= 6;

  const classification = score >= 70 ? SEO_CLASS.A : SEO_CLASS.B;
  return policy({
    classification,
    indexable: true,
    commercialScore: score,
    searchIntent: service,
    contentQuality: isTamilNaduCity(city) ? "local" : "template",
    vendorRequired: true,
    reason: "Existing service×city page with a live booking path"
  });
}

export function classifyRoute(route = {}, { source } = {}) {
  const slug = String(route.slug || "");

  if (source === "cms") {
    return policy({
      classification: SEO_CLASS.A,
      indexable: true,
      commercialScore: FEATURED_ROUTE_SLUGS.includes(slug) ? 96 : 80,
      searchIntent: "route",
      contentQuality: "cms",
      reason: "CMS-published route — ops chose to keep it"
    });
  }

  if (FEATURED_ROUTE_SLUGS.includes(slug)) {
    return policy({
      classification: SEO_CLASS.A,
      indexable: true,
      commercialScore: slug.includes("tirupati") || slug.includes("rameswaram") ? 99 : 94,
      searchIntent: "route",
      contentQuality: "featured",
      reason: "Featured commercial corridor"
    });
  }

  return policy({
    classification: SEO_CLASS.C,
    indexable: false,
    commercialScore: 26,
    searchIntent: "route",
    contentQuality: "template",
    reason: "Mesh route outside featured corridors — keep URL, noindex"
  });
}

export function isSeoIndexable(policyRow) {
  return Boolean(policyRow?.indexable);
}

/** Highest-priority existing money pages (internal score, not rankings). */
export function highestCommercialPages() {
  return [
    { path: "/cab-booking/chennai", commercialScore: 100, intent: "cab" },
    { path: "/services/airport-taxi/chennai", commercialScore: 98, intent: "airport" },
    { path: "/routes/chennai-to-tirupati-cab", commercialScore: 99, intent: "route" },
    { path: "/services/outstation-cab/chennai", commercialScore: 96, intent: "outstation" },
    { path: "/services/one-way-cab/chennai", commercialScore: 95, intent: "one-way" },
    { path: "/acting-driver/chennai", commercialScore: 96, intent: "driver" },
    { path: "/call-driver", commercialScore: 94, intent: "book-driver" },
    { path: "/tariff", commercialScore: 90, intent: "pricing" },
    { path: "/services/hourly-rental/chennai", commercialScore: 90, intent: "local" },
    { path: "/services/car-rental/chennai", commercialScore: 88, intent: "rental" },
    { path: "/services/tempo-traveller/chennai", commercialScore: 86, intent: "tempo" },
    { path: "/routes/chennai-to-pondicherry-cab", commercialScore: 94, intent: "route" },
    { path: "/routes/chennai-to-bangalore-cab", commercialScore: 94, intent: "route" }
  ];
}

export function summarizeIndexationPolicy() {
  const cabHubs = SEO_CITIES.map((c) => classifyCityHub(c.slug, "cab-booking"));
  const driverHubs = SEO_CITIES.map((c) => classifyCityHub(c.slug, "acting-driver"));
  const services = [];
  for (const service of SEO_SERVICES) {
    for (const city of SEO_CITIES) {
      services.push({
        path: `/services/${service.slug}/${city.slug}`,
        ...classifyServiceCity(service.slug, city.slug)
      });
    }
  }
  const routes = SEO_ROUTES.map((route) => ({
    path: `/routes/${route.slug}`,
    ...classifyRoute(route)
  }));

  const all = [
    ...cabHubs.map((row, i) => ({ path: `/cab-booking/${SEO_CITIES[i].slug}`, ...row })),
    ...driverHubs.map((row, i) => ({ path: `/acting-driver/${SEO_CITIES[i].slug}`, ...row })),
    ...services,
    ...routes
  ];

  const indexable = all.filter((row) => row.indexable);
  const noindex = all.filter((row) => !row.indexable);
  return {
    cities: SEO_CITIES.length,
    services: SEO_SERVICES.length,
    routes: SEO_ROUTES.length,
    programmaticPages: all.length,
    indexable: indexable.length,
    noindex: noindex.length,
    noindexSample: noindex.slice(0, 24).map((row) => row.path),
    classC: noindex.length,
    classA: all.filter((row) => row.classification === SEO_CLASS.A).length,
    classB: all.filter((row) => row.classification === SEO_CLASS.B).length
  };
}
