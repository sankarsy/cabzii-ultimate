import { CITY_SEO_KEYWORD_ALIASES } from "./citySeoAliases";
import { SEO_ROUTES } from "./routes";

/** Short URL prefixes → canonical /services/{service}/{city} */
export const SERVICE_URL_PREFIXES = new Set([
  "car-rental",
  "cab-rental",
  "airport-taxi",
  "local-taxi",
  "outstation-cab",
  "one-way-cab",
  "driver-on-hire",
  "chauffeur-service",
  "tempo-traveller",
  "hourly-rental",
  "tour-packages",
  "holiday-packages"
]);

/** /travels/{city} or /travel/{city} → /cab-booking/{city} */
export const TRAVELS_URL_PREFIXES = new Set(["travels", "travel", "travel-agency"]);

/** Google search aliases → canonical city slug */
const CITY_SLUG_ALIASES = {
  bangalore: "bengaluru",
  bengaluru: "bengaluru",
  maduravoyal: "chennai"
};

function resolveCitySlug(raw) {
  const key = String(raw || "").toLowerCase();
  return CITY_SLUG_ALIASES[key] || key;
}

/**
 * Resolve SEO alias path to canonical path (301 target), or null.
 * Examples:
 *   /car-rental/chennai → /services/car-rental/chennai
 *   /travels/chennai → /cab-booking/chennai
 *   /travels-in-chennai → /cab-booking/chennai
 *   /car-rental-in-chennai → /services/car-rental/chennai
 */
export function resolveSeoAliasPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length === 2) {
    const [prefix, city] = parts;
    if (SERVICE_URL_PREFIXES.has(prefix)) {
      const serviceSlug = prefix === "holiday-packages" ? "tour-packages" : prefix;
      return `/services/${serviceSlug}/${resolveCitySlug(city)}`;
    }
    if (TRAVELS_URL_PREFIXES.has(prefix)) {
      return `/cab-booking/${resolveCitySlug(city)}`;
    }
  }

  if (parts.length === 1) {
    const slug = parts[0].toLowerCase();
    const cabBookingGuide = slug.match(/^cab-booking-in-chennai-complete-guide-2026$/i);
    if (cabBookingGuide) return "/blog/cab-booking-in-chennai-complete-guide-2026";

    const manualKeywordAliases = {
      "cab-booking-chennai": "/cab-booking/chennai",
      "taxi-service-chennai": "/cab-booking/chennai",
      "online-cab-booking-chennai": "/cab-booking/chennai",
      "chennai-airport-taxi": "/services/airport-taxi/chennai",
      "chennai-airport-transfer": "/services/airport-taxi/chennai",
      "airport-taxi-chennai": "/services/airport-taxi/chennai",
      "chennai-airport-pickup-taxi": "/services/airport-taxi/chennai",
      "chennai-airport-drop-taxi": "/services/airport-taxi/chennai",
      "chennai-local-taxi": "/services/local-taxi/chennai",
      "chennai-outstation-cab": "/services/outstation-cab/chennai",
      "chennai-one-way-taxi": "/services/one-way-cab/chennai",
      "one-way-taxi-chennai": "/services/one-way-cab/chennai",
      "outstation-cab-chennai": "/services/outstation-cab/chennai",
      "chennai-to-trichy-cabs": "/routes/chennai-to-trichy-cab",
      "chennai-to-trichy-cab-service": "/routes/chennai-to-trichy-cab",
      "chennai-to-trichy-one-way-taxi": "/routes/chennai-to-trichy-cab",
      "chennai-to-trichy-oneway-taxi": "/routes/chennai-to-trichy-cab",
      "chennai-to-trichy-distance-by-car": "/routes/chennai-to-trichy-cab",
      "cab-from-chennai-to-trichy": "/routes/chennai-to-trichy-cab",
      "tirupati-car-booking": "/routes/chennai-to-tirupati-cab",
      "chennai-tirupati-car-rental": "/routes/chennai-to-tirupati-cab",
      "chennai-to-tirupati-cab-booking": "/routes/chennai-to-tirupati-cab",
      "chennai-to-tirupati-taxi": "/routes/chennai-to-tirupati-cab",
      "chennai-to-tirupati-car-rental": "/routes/chennai-to-tirupati-cab",
      "chennai-to-rameswaram-cab": "/routes/chennai-to-rameswaram-cab",
      "chennai-to-rameswaram-taxi": "/routes/chennai-to-rameswaram-cab",
      "madurai-to-rameswaram-cab": "/routes/madurai-to-rameswaram-cab",
      "coimbatore-to-ooty-cab": "/routes/coimbatore-to-ooty-cab",
      "coimbatore-to-ooty-taxi": "/routes/coimbatore-to-ooty-cab",
      "tirupati-cab-booking": "/cab-booking/tirupati",
      "taxi-in-tirupati": "/cab-booking/tirupati",
      "chennai-to-pondicherry-cab": "/routes/chennai-to-pondicherry-cab",
      "bangalore-airport-taxi": "/services/airport-taxi/bengaluru",
      "bangalore-airport-pickup": "/services/airport-taxi/bengaluru",
      "bengaluru-airport-taxi": "/services/airport-taxi/bengaluru",
      "bangalore-airport-pickup-12-hour-package": "/services/hourly-rental/bengaluru",
      "bangalore-12-hour-cab-package": "/services/hourly-rental/bengaluru"
    };
    const keywordAliases = { ...CITY_SEO_KEYWORD_ALIASES, ...manualKeywordAliases };
    if (keywordAliases[slug]) return keywordAliases[slug];

    const cabBookingIn = slug.match(/^cab-booking-in-(.+)$/i);
    if (cabBookingIn) return `/cab-booking/${resolveCitySlug(cabBookingIn[1])}`;

    const actingDriverIn = slug.match(/^acting-driver-in-(.+)$/i);
    if (actingDriverIn) return `/acting-driver/${resolveCitySlug(actingDriverIn[1])}`;

    const travelsIn = slug.match(/^travels-in-(.+)$/i);
    if (travelsIn) return `/cab-booking/${resolveCitySlug(travelsIn[1])}`;

    if (/^car-rental-maduravoyal$/i.test(slug)) {
      return "/services/car-rental/chennai";
    }

    const carRentalIn = slug.match(/^car-rental-in-(.+)$/i);
    if (carRentalIn) return `/services/car-rental/${resolveCitySlug(carRentalIn[1])}`;

    const cabRentalIn = slug.match(/^cab-rental-in-(.+)$/i);
    if (cabRentalIn) return `/services/cab-rental/${resolveCitySlug(cabRentalIn[1])}`;

    const routeCab = slug.match(/^([a-z]+)-to-([a-z]+)-cab$/i);
    if (routeCab) {
      const routeSlug = `${resolveCitySlug(routeCab[1])}-to-${resolveCitySlug(routeCab[2])}-cab`;
      if (SEO_ROUTES.some((r) => r.slug === routeSlug)) return `/routes/${routeSlug}`;
    }

    const routeTaxi = slug.match(/^([a-z]+)-to-([a-z]+)-taxi$/i);
    if (routeTaxi) {
      const routeSlug = `${resolveCitySlug(routeTaxi[1])}-to-${resolveCitySlug(routeTaxi[2])}-cab`;
      if (SEO_ROUTES.some((r) => r.slug === routeSlug)) return `/routes/${routeSlug}`;
    }
  }

  return null;
}
