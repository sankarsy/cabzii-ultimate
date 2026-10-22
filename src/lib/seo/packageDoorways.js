import { actingDriverLandingPath, cityCabLandingPath, isActingDriverHubCity } from "../cityCabPaths";

/**
 * Fare-package / duplicate-intent service landings — not ranking pages.
 * Cab 4hr/8hr slabs and Call Driver cards book on city hubs instead.
 */
export const PACKAGE_DOORWAY_SERVICE_SLUGS = [
  "hourly-rental",
  "local-taxi",
  "car-rental",
  "cab-rental",
  "driver-on-hire",
  "chauffeur-service",
  "tour-packages"
];

/** Service URLs that should stay in Google: trip type, not a fare slab. */
export const RANKING_SERVICE_SLUGS = ["airport-taxi", "outstation-cab", "one-way-cab", "tempo-traveller"];

export function isPackageDoorwayService(slug) {
  return PACKAGE_DOORWAY_SERVICE_SLUGS.includes(String(slug || ""));
}

export function isRankingService(slug) {
  return RANKING_SERVICE_SLUGS.includes(String(slug || ""));
}

/** Where old package SEO URLs should 301. */
export function packageDoorwayCanonicalPath(serviceSlug, citySlug = "chennai") {
  const service = String(serviceSlug || "");
  const city = String(citySlug || "chennai").toLowerCase();
  if (service === "driver-on-hire" || service === "chauffeur-service") {
    return isActingDriverHubCity(city) ? actingDriverLandingPath(city) : "/call-driver";
  }
  if (service === "tour-packages") return "/holidays";
  return cityCabLandingPath(city);
}
