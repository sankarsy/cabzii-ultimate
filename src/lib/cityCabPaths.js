/** Canonical city taxi landing: /{city} (FastTrack-style). Legacy /car-rental/{city}-city-cabs 301s here. */

export const CITY_CABS_SUFFIX = "-city-cabs";
export const CITY_CABS_HUB_PATH = "/car-rental";
export const CALL_DRIVERS_CHENNAI_PATH = "/call-drivers-chennai";
export const AIRPORT_CAB_BOOKING_SEGMENT = "airport-cab-booking";
export const AIRPORT_CAB_BOOKING_CITIES = ["chennai", "trichy", "madurai", "coimbatore"];
export const ACTING_DRIVER_SEGMENT = "acting-driver";
export const ACTING_DRIVER_HUB_CITIES = AIRPORT_CAB_BOOKING_CITIES;
export const TRICHY_CITY_ALIASES = ["tiruchi", "tiruchirappalli", "tiruchirapalli"];

export function cityCabLandingSlug(citySlug) {
  return `${String(citySlug || "").toLowerCase()}${CITY_CABS_SUFFIX}`;
}

export function cityCabLandingPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (!slug) return CITY_CABS_HUB_PATH;
  return `/${slug}`;
}

export function legacyCityCabLandingPath(citySlug) {
  return `${CITY_CABS_HUB_PATH}/${cityCabLandingSlug(citySlug)}`;
}

export function parseCityCabLandingSlug(slug) {
  const raw = String(slug || "").toLowerCase();
  if (!raw.endsWith(CITY_CABS_SUFFIX)) return null;
  const citySlug = raw.slice(0, -CITY_CABS_SUFFIX.length);
  return /^[a-z0-9-]+$/.test(citySlug) ? citySlug : null;
}

export function isCityCabLandingPath(pathname) {
  const parts = String(pathname || "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  if (parts.length === 1 && /^[a-z0-9-]+$/.test(parts[0])) return true;
  return parts.length === 2 && parts[0] === "car-rental" && Boolean(parseCityCabLandingSlug(parts[1]));
}

export function isActingDriverHubCity(citySlug) {
  return ACTING_DRIVER_HUB_CITIES.includes(String(citySlug || "").toLowerCase());
}

/** Canonical acting-driver landing: /{city}/acting-driver for ranking hubs. */
export function actingDriverLandingPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (!slug) return `/${ACTING_DRIVER_SEGMENT}`;
  if (isActingDriverHubCity(slug)) return `/${slug}/${ACTING_DRIVER_SEGMENT}`;
  return `/${ACTING_DRIVER_SEGMENT}/${slug}`;
}

export function legacyActingDriverLandingPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (!slug) return `/${ACTING_DRIVER_SEGMENT}`;
  if (slug === "chennai") return CALL_DRIVERS_CHENNAI_PATH;
  return `/${ACTING_DRIVER_SEGMENT}/${slug}`;
}

export function isAirportCabBookingCity(citySlug) {
  return AIRPORT_CAB_BOOKING_CITIES.includes(String(citySlug || "").toLowerCase());
}

/** Canonical airport taxi landing: /{city}/airport-cab-booking */
export function airportCabBookingPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (!slug) return `/${AIRPORT_CAB_BOOKING_SEGMENT}`;
  return `/${slug}/${AIRPORT_CAB_BOOKING_SEGMENT}`;
}

/** Ranking airport hubs use /{city}/airport-cab-booking; other cities keep /services/airport-taxi/{city}. */
export function airportTaxiPublicPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (isAirportCabBookingCity(slug)) return airportCabBookingPath(slug);
  return `/services/airport-taxi/${slug}`;
}

/** Live URL for CMS city pages (cab-booking / acting-driver / airport-cab-booking). */
export function seoCityPublicPath(pageType, citySlug) {
  if (pageType === "acting-driver") return actingDriverLandingPath(citySlug);
  if (pageType === "airport-cab-booking") return airportCabBookingPath(citySlug);
  return cityCabLandingPath(citySlug);
}
