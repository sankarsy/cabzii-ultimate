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
      return `/services/${prefix}/${city}`;
    }
    if (TRAVELS_URL_PREFIXES.has(prefix)) {
      return `/cab-booking/${city}`;
    }
  }

  if (parts.length === 1) {
    const slug = parts[0];
    const cabBookingGuide = slug.match(/^cab-booking-in-chennai-complete-guide-2026$/i);
    if (cabBookingGuide) return "/blog/cab-booking-in-chennai-complete-guide-2026";

    const cabBookingIn = slug.match(/^cab-booking-in-(.+)$/i);
    if (cabBookingIn) return `/cab-booking/${cabBookingIn[1].toLowerCase()}`;

    const actingDriverIn = slug.match(/^acting-driver-in-(.+)$/i);
    if (actingDriverIn) return `/acting-driver/${actingDriverIn[1].toLowerCase()}`;

    const travelsIn = slug.match(/^travels-in-(.+)$/i);
    if (travelsIn) return `/cab-booking/${travelsIn[1].toLowerCase()}`;

    const carRentalIn = slug.match(/^car-rental-in-(.+)$/i);
    if (carRentalIn) return `/services/car-rental/${carRentalIn[1].toLowerCase()}`;

    const cabRentalIn = slug.match(/^cab-rental-in-(.+)$/i);
    if (cabRentalIn) return `/services/cab-rental/${cabRentalIn[1].toLowerCase()}`;
  }

  return null;
}
