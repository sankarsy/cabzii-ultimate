import { CITY_SEO_KEYWORD_ALIASES } from "./citySeoAliases";
import { SEO_ROUTES } from "./routes";
import { VEHICLE_KEYWORD_ALIASES } from "./vehicleKeywordMap";
import { cityBySlug } from "./cities";
import { actingDriverLandingPath, cityCabLandingPath, parseCityCabLandingSlug, airportTaxiPublicPath } from "../cityCabPaths";
import { routePublicPath, parseLegacyRoutesPathname } from "./outstationPaths";

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

/** /travels/{city} or /travel/{city} → /{city} */
export const TRAVELS_URL_PREFIXES = new Set(["travels", "travel", "travel-agency"]);

/** Google search aliases → canonical city slug */
const CITY_SLUG_ALIASES = {
  bangalore: "bengaluru",
  bengaluru: "bengaluru",
  maduravoyal: "chennai",
  kancheepuram: "kanchipuram",
  kanchepuram: "kanchipuram",
  tuticorin: "thoothukudi",
  tirupur: "tiruppur",
  tiruchi: "trichy",
  tiruchirappalli: "trichy",
  tanjore: "thanjavur",
  kanniyakumari: "kanyakumari",
  thiruvannamalai: "tiruvannamalai"
};

function resolveCitySlug(raw) {
  const key = String(raw || "").toLowerCase();
  return CITY_SLUG_ALIASES[key] || key;
}

/**
 * Resolve SEO alias path to canonical path (301 target), or null.
 * Examples:
 *   /car-rental/chennai → /services/car-rental/chennai
 *   /travels/chennai → /chennai
 *   /travels-in-chennai → /chennai
 *   /car-rental/chennai-city-cabs → /chennai
 *   /car-rental-in-chennai → /services/car-rental/chennai
 */
export function resolveSeoAliasPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length === 2) {
    const [prefix, city] = parts;
    if (prefix === "car-rental" && parseCityCabLandingSlug(city)) {
      return cityCabLandingPath(parseCityCabLandingSlug(city));
    }
    if (prefix === "cab-booking") {
      return cityCabLandingPath(resolveCitySlug(city));
    }
    if (prefix === "acting-driver") {
      const citySlug = resolveCitySlug(city);
      const next = actingDriverLandingPath(citySlug);
      return next === `/acting-driver/${citySlug}` ? null : next;
    }
    if (SERVICE_URL_PREFIXES.has(prefix)) {
      const serviceSlug = prefix === "holiday-packages" ? "tour-packages" : prefix;
      const citySlug = resolveCitySlug(city);
      /* Package SEO landings live at /tour-packages/{package-slug}. Only city hubs alias. */
      if ((prefix === "tour-packages" || prefix === "holiday-packages") && !cityBySlug(citySlug)) {
        return null;
      }
      if (prefix === "airport-taxi") return airportTaxiPublicPath(citySlug);
      return `/services/${serviceSlug}/${citySlug}`;
    }
    if (TRAVELS_URL_PREFIXES.has(prefix)) {
      return cityCabLandingPath(resolveCitySlug(city));
    }
  }

  if (parts.length === 1) {
    const slug = parts[0].toLowerCase();
    const cabBookingGuide = slug.match(/^cab-booking-in-chennai-complete-guide-2026$/i);
    if (cabBookingGuide) return "/blog/cab-booking-in-chennai-complete-guide-2026";

    const manualKeywordAliases = {
      "cab-booking-chennai": cityCabLandingPath("chennai"),
      "taxi-service-chennai": cityCabLandingPath("chennai"),
      "online-cab-booking-chennai": cityCabLandingPath("chennai"),
      "chennai-airport-taxi": "/chennai/airport-cab-booking",
      "chennai-airport-transfer": "/chennai/airport-cab-booking",
      "airport-taxi-chennai": "/chennai/airport-cab-booking",
      "chennai-airport-pickup-taxi": "/chennai/airport-cab-booking",
      "chennai-airport-drop-taxi": "/chennai/airport-cab-booking",
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
      "acting-driver-chennai": "/chennai/acting-driver",
      "call-driver-chennai": "/chennai/acting-driver",
      "hire-drivers-chennai": "/chennai/acting-driver",
      "hire-acting-drivers-chennai": "/chennai/acting-driver",
      "call-drivers-chennai": "/chennai/acting-driver",
      "tirupati-cab-booking": cityCabLandingPath("tirupati"),
      "taxi-in-tirupati": cityCabLandingPath("tirupati"),
      "chennai-to-pondicherry-cab": "/routes/chennai-to-pondicherry-cab",
      "bangalore-airport-taxi": "/services/airport-taxi/bengaluru",
      "bangalore-airport-pickup": "/services/airport-taxi/bengaluru",
      "bengaluru-airport-taxi": "/services/airport-taxi/bengaluru",
      "bangalore-airport-pickup-12-hour-package": "/services/hourly-rental/bengaluru",
      "bangalore-12-hour-cab-package": "/services/hourly-rental/bengaluru",
      "tour-s-taxi-booking-chennai": cityCabLandingPath("chennai"),
      "tours-taxi-booking-chennai": cityCabLandingPath("chennai"),
      "tour-s-taxi-chennai": cityCabLandingPath("chennai"),
      "dzire-tour-s-taxi-chennai": cityCabLandingPath("chennai"),
      "dzire-tour-s-taxi-booking-chennai": cityCabLandingPath("chennai")
    };
    const keywordAliases = { ...CITY_SEO_KEYWORD_ALIASES, ...VEHICLE_KEYWORD_ALIASES, ...manualKeywordAliases };
    if (keywordAliases[slug]) return parseLegacyRoutesPathname(keywordAliases[slug]) || keywordAliases[slug];

    const cabBookingIn = slug.match(/^cab-booking-in-(.+)$/i);
    if (cabBookingIn) return cityCabLandingPath(resolveCitySlug(cabBookingIn[1]));

    const actingDriverIn = slug.match(/^acting-driver-in-(.+)$/i);
    if (actingDriverIn) {
      return actingDriverLandingPath(resolveCitySlug(actingDriverIn[1]));
    }

    const travelsIn = slug.match(/^travels-in-(.+)$/i);
    if (travelsIn) return cityCabLandingPath(resolveCitySlug(travelsIn[1]));

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
      if (SEO_ROUTES.some((r) => r.slug === routeSlug)) return routePublicPath(routeSlug);
    }

    const routeTaxi = slug.match(/^([a-z]+)-to-([a-z]+)-taxi$/i);
    if (routeTaxi) {
      const routeSlug = `${resolveCitySlug(routeTaxi[1])}-to-${resolveCitySlug(routeTaxi[2])}-cab`;
      if (SEO_ROUTES.some((r) => r.slug === routeSlug)) return routePublicPath(routeSlug);
    }
  }

  return null;
}
