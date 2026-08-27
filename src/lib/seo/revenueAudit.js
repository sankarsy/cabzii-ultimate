/**
 * Phase 2 revenue SEO audit — internal scoring only.
 * Scores are Cabzii business-priority estimates, not Google volumes, rankings or GMV.
 * Booking and revenue analytics: data unavailable from this repo (do not invent).
 */

import { FEATURED_ROUTE_SLUGS } from "./featuredRoutes";
import { cityBySlug, isPrimaryFocusCity, isTamilNaduCity, SEO_CITIES } from "./cities";
import { SEO_SERVICES } from "./services";
import { SEO_ROUTES } from "./routes";
import { cityHasCommercialAirport } from "./airports";
import {
  classifyCityHub,
  classifyRoute,
  classifyServiceCity,
  SEO_CLASS
} from "./indexation";
import { featuredRouteUniqueHtml } from "./featuredRouteContent";
import { chennaiServiceUniqueHtml } from "./chennaiServiceContent";
import { chennaiCabUniqueHtml, chennaiDriverUniqueHtml } from "./chennaiCluster";

export const BOOKING_DATA_AVAILABLE = false;
export const REVENUE_DATA_AVAILABLE = false;
export const BOOKING_DATA_NOTE =
  "landing → booking_started → booking_completed rates: data unavailable (no analytics dump in this environment).";
export const REVENUE_DATA_NOTE =
  "bookings, average booking value, GMV, revenue: data unavailable. Do not treat commercialScore as GMV.";

function clamp10(n) {
  return Math.max(1, Math.min(10, Math.round(n)));
}

function vendorSupplyScore(citySlug) {
  if (citySlug === "chennai") return 8;
  if (["coimbatore", "madurai", "trichy"].includes(citySlug)) return 5;
  if (isTamilNaduCity(citySlug) || citySlug === "pondicherry" || citySlug === "tirupati") return 4;
  if (["bengaluru", "hyderabad", "kochi", "mysore"].includes(citySlug)) return 5;
  return 3;
}

function contentQualityScore({ pageType, city, service, route }) {
  if (pageType === "service" && city === "chennai" && chennaiServiceUniqueHtml(service).length > 400) return 8;
  if (pageType === "city-hub" && city === "chennai" && chennaiCabUniqueHtml().length > 400) return 8;
  if (pageType === "acting-driver" && city === "chennai" && chennaiDriverUniqueHtml().length > 400) return 8;
  if (pageType === "route" && route && featuredRouteUniqueHtml(route).length > 200) return 8;
  if (city === "chennai") return 6;
  if (isPrimaryFocusCity(city)) return 4;
  return 3;
}

function avgValueScore({ pageType, service, route }) {
  if (pageType === "route") {
    const fare = Number(route?.sedanFrom) || 0;
    if (fare >= 6000) return 8;
    if (fare >= 3000) return 7;
    return 6;
  }
  if (service === "tempo-traveller" || service === "outstation-cab") return 8;
  if (service === "airport-taxi" || service === "one-way-cab") return 7;
  if (service === "acting-driver" || pageType === "call-driver") return 6;
  if (service === "hourly-rental" || service === "car-rental") return 6;
  return 5;
}

function competitionScore({ pageType, city, service }) {
  if (city === "chennai" && (service === "airport-taxi" || pageType === "route")) return 9;
  if (city === "chennai") return 8;
  if (city === "bengaluru" || city === "hyderabad") return 9;
  if (city === "delhi" || city === "mumbai") return 10;
  return 6;
}

function scoreRow(base) {
  const searchIntent = clamp10(base.searchIntent);
  const commercialIntent = clamp10(base.commercialIntent);
  const bookingPotential = clamp10(base.bookingPotential);
  const averageBookingValue = clamp10(base.averageBookingValue);
  const vendorSupply = clamp10(base.vendorSupply);
  const contentQuality = clamp10(base.contentQuality);
  const competition = clamp10(base.competition);
  const conversionReadiness = clamp10(base.conversionReadiness);
  const composite = clamp10(
    (searchIntent * 1.2 +
      commercialIntent * 1.3 +
      bookingPotential * 1.4 +
      averageBookingValue * 1.1 +
      vendorSupply * 1.2 +
      contentQuality * 1.1 +
      conversionReadiness * 1.3 -
      competition * 0.4) /
      8.2
  );
  return {
    ...base,
    searchIntent,
    commercialIntent,
    bookingPotential,
    averageBookingValue,
    vendorSupply,
    contentQuality,
    competition,
    conversionReadiness,
    composite,
    bookingData: "unavailable",
    revenueData: "unavailable"
  };
}

function auditCityHub(city, variant) {
  const policy = classifyCityHub(city.slug, variant === "acting-driver" ? "acting-driver" : "cab-booking");
  const pageType = variant === "acting-driver" ? "acting-driver" : "city-hub";
  const path = variant === "acting-driver" ? `/acting-driver/${city.slug}` : `/cab-booking/${city.slug}`;
  const hqBoost = city.slug === "chennai" ? 3 : 0;
  return scoreRow({
    url: path,
    pageType,
    city: city.slug,
    service: variant === "acting-driver" ? "acting-driver" : "cab-booking",
    origin: city.slug,
    destination: "",
    commercialScore: policy.commercialScore,
    class: policy.classification,
    indexable: policy.indexable,
    serviceAvailable: city.slug === "chennai" ? "hq-assumed" : "unknown",
    vendorSupplyLabel: city.slug === "chennai" ? "HQ market — supply assumed stronger" : "vendor count unknown",
    bookingPath: variant === "acting-driver" ? "/call-driver" : "/cabs",
    cta: variant === "acting-driver" ? "Call Driver" : "Search cabs",
    duplicateRisk: variant === "acting-driver" ? "overlaps driver-on-hire + chauffeur city pages" : "low",
    searchIntent: 6 + hqBoost,
    commercialIntent: 6 + hqBoost,
    bookingPotential: 6 + hqBoost,
    averageBookingValue: avgValueScore({ pageType, service: variant }),
    vendorSupply: vendorSupplyScore(city.slug),
    contentQuality: contentQualityScore({ pageType, city: city.slug }),
    competition: competitionScore({ pageType, city: city.slug }),
    conversionReadiness: city.slug === "chennai" ? 8 : 5
  });
}

function auditService(service, city) {
  const policy = classifyServiceCity(service.slug, city.slug);
  const hqBoost = city.slug === "chennai" ? 2 : 0;
  const airportBoost = service.slug === "airport-taxi" && cityHasCommercialAirport(city.slug) ? 2 : 0;
  return scoreRow({
    url: `/services/${service.slug}/${city.slug}`,
    pageType: "service",
    city: city.slug,
    service: service.slug,
    origin: city.slug,
    destination: "",
    commercialScore: policy.commercialScore,
    class: policy.classification,
    indexable: policy.indexable,
    serviceAvailable: city.slug === "chennai" ? "hq-assumed" : "unknown",
    vendorSupplyLabel: "partner availability shown only at search — not counted here",
    bookingPath: ["driver-on-hire", "chauffeur-service"].includes(service.slug) ? "/call-driver" : "/cabs",
    cta: "Book / search widget",
    duplicateRisk:
      service.slug === "cab-rental" || service.slug === "car-rental"
        ? "same chauffeur-driven intent as hourly/local"
        : service.slug === "driver-on-hire" || service.slug === "chauffeur-service"
          ? "same intent as acting-driver city page"
          : "low",
    searchIntent: 5 + hqBoost + airportBoost,
    commercialIntent: 5 + hqBoost + airportBoost,
    bookingPotential: 5 + hqBoost + airportBoost,
    averageBookingValue: avgValueScore({ pageType: "service", service: service.slug }),
    vendorSupply: vendorSupplyScore(city.slug),
    contentQuality: contentQualityScore({ pageType: "service", city: city.slug, service: service.slug }),
    competition: competitionScore({ pageType: "service", city: city.slug, service: service.slug }),
    conversionReadiness: city.slug === "chennai" ? 8 : 4
  });
}

function auditRoute(route) {
  const policy = classifyRoute(route);
  const featured = FEATURED_ROUTE_SLUGS.includes(route.slug);
  return scoreRow({
    url: `/routes/${route.slug}`,
    pageType: "route",
    city: route.from,
    service: "one-way-cab",
    origin: route.from,
    destination: route.to,
    commercialScore: policy.commercialScore,
    class: policy.classification,
    indexable: policy.indexable,
    serviceAvailable: route.from === "chennai" || featured ? "route-catalog" : "unknown",
    vendorSupplyLabel: "unknown at page level",
    bookingPath: "/cabs",
    cta: "Book route widget",
    duplicateRisk: "reverse route and outstation page share intent — keep distinct CTAs",
    searchIntent: featured ? 8 : 5,
    commercialIntent: featured ? 8 : 5,
    bookingPotential: featured ? 8 : 5,
    averageBookingValue: avgValueScore({ pageType: "route", route }),
    vendorSupply: vendorSupplyScore(route.from),
    contentQuality: contentQualityScore({ pageType: "route", city: route.from, route }),
    competition: competitionScore({ pageType: "route", city: route.from }),
    conversionReadiness: featured ? 8 : 5
  });
}

const STATIC_MONEY_PAGES = [
  scoreRow({
    url: "/call-driver",
    pageType: "call-driver",
    city: "chennai",
    service: "acting-driver",
    origin: "chennai",
    destination: "",
    commercialScore: 94,
    class: SEO_CLASS.A,
    indexable: true,
    serviceAvailable: "hq-assumed",
    vendorSupplyLabel: "HQ market — supply assumed stronger",
    bookingPath: "/call-driver",
    cta: "Choose Call Driver service",
    duplicateRisk: "same intent as /acting-driver/chennai (guide vs book)",
    searchIntent: 8,
    commercialIntent: 9,
    bookingPotential: 9,
    averageBookingValue: 6,
    vendorSupply: 8,
    contentQuality: 7,
    competition: 8,
    conversionReadiness: 9
  }),
  scoreRow({
    url: "/tariff",
    pageType: "tariff",
    city: "chennai",
    service: "pricing",
    origin: "chennai",
    destination: "",
    commercialScore: 90,
    class: SEO_CLASS.A,
    indexable: true,
    serviceAvailable: "published-rate-card",
    vendorSupplyLabel: "n/a",
    bookingPath: "/cabs",
    cta: "Search live cabs",
    duplicateRisk: "low",
    searchIntent: 7,
    commercialIntent: 8,
    bookingPotential: 7,
    averageBookingValue: 7,
    vendorSupply: 8,
    contentQuality: 8,
    competition: 6,
    conversionReadiness: 8
  }),
  scoreRow({
    url: "/holidays?category=pilgrimage",
    pageType: "holidays",
    city: "chennai",
    service: "pilgrimage",
    origin: "chennai",
    destination: "",
    commercialScore: 84,
    class: SEO_CLASS.A,
    indexable: true,
    serviceAvailable: "package-catalog",
    vendorSupplyLabel: "depends on listed packages",
    bookingPath: "/holidays",
    cta: "Book package",
    duplicateRisk: "do not add /pilgrimage tree",
    searchIntent: 8,
    commercialIntent: 8,
    bookingPotential: 7,
    averageBookingValue: 8,
    vendorSupply: 5,
    contentQuality: 6,
    competition: 8,
    conversionReadiness: 7
  })
];

export function auditAllCommercialPages() {
  const hubs = SEO_CITIES.map((c) => auditCityHub(c, "cab-booking"));
  const drivers = SEO_CITIES.map((c) => auditCityHub(c, "acting-driver"));
  const services = [];
  for (const service of SEO_SERVICES) {
    for (const city of SEO_CITIES) {
      services.push(auditService(service, city));
    }
  }
  const routes = SEO_ROUTES.map(auditRoute);
  return [...STATIC_MONEY_PAGES, ...hubs, ...drivers, ...services, ...routes];
}

function top(list, n = 20) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = item.url || JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= n) break;
  }
  return out;
}

export function revenueSeoReport() {
  const all = auditAllCommercialPages();
  const indexable = all.filter((p) => p.indexable);

  const topMoneyPages = top(
    [...indexable].sort((a, b) => b.composite - a.composite || b.commercialScore - a.commercialScore)
  );

  const topContentImprovement = top(
    [...indexable]
      .filter((p) => p.contentQuality <= 5)
      .sort((a, b) => a.contentQuality - b.contentQuality || b.commercialScore - a.commercialScore)
      .concat(
        [...indexable]
          .filter((p) => p.contentQuality === 6 && p.city !== "chennai")
          .sort((a, b) => b.commercialScore - a.commercialScore)
      )
  );

  const topSupplyRisk = top(
    [...indexable]
      .filter((p) => p.vendorSupply <= 4)
      .sort((a, b) => a.vendorSupply - b.vendorSupply || b.commercialIntent - a.commercialIntent)
  );

  const topRouteOpportunities = top(
    indexable
      .filter((p) => p.pageType === "route")
      .sort((a, b) => b.composite - a.composite)
  );

  const topAirportOpportunities = top(
    indexable
      .filter((p) => p.service === "airport-taxi")
      .sort((a, b) => b.composite - a.composite)
  );

  const topPilgrimageOpportunities = [
    { url: "/holidays?category=pilgrimage", note: "Existing package filter — do not build /pilgrimage/{temple}" },
    { url: "/routes/chennai-to-tirupati-cab", note: "Highest cab-only darshan corridor" },
    { url: "/routes/chennai-to-rameswaram-cab", note: "Long pilgrimage one-way" },
    { url: "/routes/chennai-to-kanchipuram-cab", note: "Short temple hop" },
    { url: "/routes/chennai-to-tiruvannamalai-cab", note: "Girivalam / Arunachaleswarar" },
    { url: "/routes/madurai-to-rameswaram-cab", note: "Same-day temple pairing" },
    { url: "/routes/chennai-to-madurai-cab", note: "Meenakshi + onward south" },
    { url: "/routes/chennai-to-kanyakumari-cab", note: "Long coastal/temple highway" },
    { url: "/cab-booking/tirupati", note: "Destination hub — keep, do not spawn temple URLs" },
    { url: "/services/tour-packages/chennai", note: "Chennai origin tour landing only" }
  ];

  const topActingDriverOpportunities = top(
    indexable
      .filter((p) => p.service === "acting-driver" || p.url.includes("driver-on-hire") || p.url.includes("chauffeur-service") || p.pageType === "call-driver")
      .sort((a, b) => b.composite - a.composite)
  );

  const tnCities = [
    "chennai",
    "coimbatore",
    "madurai",
    "trichy",
    "salem",
    "vellore",
    "tirunelveli",
    "thanjavur",
    "kanchipuram",
    "tiruvannamalai",
    "rameswaram",
    "kanyakumari",
    "ooty",
    "pondicherry",
    "tirupati"
  ].map((slug) => {
    const city = cityBySlug(slug);
    const airport = cityHasCommercialAirport(slug);
    return {
      city: slug,
      name: city?.name || slug,
      airport: airport ? "local-commercial" : "nearest-or-none",
      vendorSupply: vendorSupplyScore(slug),
      uniqueContent: slug === "chennai" ? "phase-2-unique" : "mostly-template",
      bookingCapability: slug === "chennai" ? "full-hq-path" : "search-widget-exists-supply-unknown",
      priority: slug === "chennai" ? "A" : ["coimbatore", "madurai", "trichy"].includes(slug) ? "B" : "C-audit-only",
      doNotMassPublish: true
    };
  });

  const southIndia = ["bengaluru", "hyderabad", "kochi", "mysore", "mangalore", "tirupati"].map((slug) => ({
    city: slug,
    note:
      slug === "mangalore"
        ? "Not in SEO_CITIES — do not publish a new city tree in Phase 2"
        : "Existing city hub/services already live; do not mass-publish extra combinations",
    vendorSupply: slug === "mangalore" ? 2 : vendorSupplyScore(slug),
    priority: slug === "bengaluru" || slug === "tirupati" ? "B-existing-pages" : "audit-only"
  }));

  const nationalExpansion = [
    ["delhi", "airport-taxi", 9, 8, 3, "high", "A-later"],
    ["delhi", "outstation-cab", 8, 8, 3, "high", "B-later"],
    ["mumbai", "airport-taxi", 9, 9, 3, "high", "A-later"],
    ["mumbai", "outstation-cab", 8, 8, 3, "high", "B-later"],
    ["pune", "airport-taxi", 7, 7, 3, "high", "C-later"],
    ["pune", "outstation-cab", 7, 7, 3, "medium", "C-later"],
    ["kolkata", "airport-taxi", 7, 6, 2, "high", "D-later"],
    ["hyderabad", "airport-taxi", 8, 8, 5, "high", "B-existing"],
    ["goa", "car-rental", 8, 7, 4, "high", "B-existing-clarify-chauffeur"],
    ["jaipur", "airport-taxi", 6, 6, 2, "high", "D-later"]
  ].map(([city, service, intent, value, supply, competition, priority]) => ({
    city,
    service,
    potentialBookingIntent: intent,
    potentialBookingValue: value,
    supplyConfidence: supply,
    contentRequirement: city === "chennai" ? "maintain unique" : "full unique local copy before any push",
    competitionLevel: competition,
    priority,
    note: "Internal 1–10 scores — not search volume. Do not mass-publish in Phase 2."
  }));

  const futureOpportunities = top(
    all
      .filter((p) => !p.indexable || p.class === SEO_CLASS.C || (p.city !== "chennai" && p.contentQuality <= 4 && p.commercialScore >= 40))
      .sort((a, b) => b.commercialScore - a.commercialScore)
  );

  return {
    bookingDataAvailable: BOOKING_DATA_AVAILABLE,
    revenueDataAvailable: REVENUE_DATA_AVAILABLE,
    bookingDataNote: BOOKING_DATA_NOTE,
    revenueDataNote: REVENUE_DATA_NOTE,
    topMoneyPages,
    topContentImprovement,
    topSupplyRisk,
    topRouteOpportunities,
    topAirportOpportunities,
    topPilgrimageOpportunities,
    topActingDriverOpportunities,
    tnCities,
    southIndia,
    nationalExpansion,
    futureOpportunities,
    topServices: [
      { service: "airport-taxi", why: "High commercial intent at real airports; Chennai MAA is HQ" },
      { service: "outstation-cab", why: "Round-trip / wait packages; 250 km car min is a real tariff rule" },
      { service: "one-way-cab", why: "Route fares; feeds existing /routes URLs" },
      { service: "acting-driver", why: "Own-car chauffeur; book on /call-driver" },
      { service: "tempo-traveller", why: "Group hire AOV; not bus tickets" },
      { service: "hourly-rental", why: "Local 4/8hr packages from published tariff" },
      { service: "car-rental", why: "Chauffeur-driven only — must not imply self-drive" }
    ],
    competitorIntentGaps: [
      "Airport pickup + drop + city transfer mapped to one Chennai URL (done) — other cities still template",
      "Round-trip intent must stay on outstation pages (no /round-trip-cab)",
      "Acting driver synonyms stay on /acting-driver/{city} + /call-driver",
      "Pilgrimage intent: holidays filter + temple routes — no /pilgrimage tree",
      "Self-drive SERPs should not be chased; Cabzii is chauffeur-driven",
      "National airport pages exist but supply/content are weak — do not scale copy until supply is known"
    ],
    supplyRisks: [
      "Vendor counts are unknown outside Chennai HQ assumption",
      "Non-Chennai airport/outstation pages can rank into unserviced demand",
      "Long-haul routes already noindex in Phase 1 — leave unchanged"
    ],
    contentRisks: [
      "Non-Chennai city/service bodies remain templated",
      "cab-rental vs car-rental vs hourly still overlap (same product, different queries)",
      "driver-on-hire and chauffeur-service still indexable and overlap acting-driver"
    ]
  };
}
