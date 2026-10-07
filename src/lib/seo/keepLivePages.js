/**
 * Keep only previously created / Google-known pages.
 * Extra programmatic city×service×route SEO landings 301 away so a new
 * structure can be added later without a thin URL farm.
 */
import { cityBySlug } from "./cities";
import { isPackageDoorwayService, packageDoorwayCanonicalPath } from "./packageDoorways";
import {
  actingDriverLandingPath,
  airportCabBookingPath,
  cityCabLandingPath
} from "../cityCabPaths";
import { outstationPathFromLegacySlug, parseOutstationRouteSegment } from "./outstationPaths";

export const KEEP_SEO_CITY_SLUGS = ["chennai"];
export const KEEP_AIRPORT_CITY_SLUGS = ["chennai"];
export const KEEP_ACTING_DRIVER_CITY_SLUGS = ["chennai", "tirupati"];
export const KEEP_RANKING_SERVICE_PAGES = [{ service: "outstation-cab", city: "chennai" }];
export const KEEP_ROUTE_SLUGS = ["chennai-to-tirupati-cab", "chennai-to-bangalore-cab"];

export function isKeepSeoCity(slug) {
  return KEEP_SEO_CITY_SLUGS.includes(String(slug || "").toLowerCase());
}

export function isKeepAirportCity(slug) {
  return KEEP_AIRPORT_CITY_SLUGS.includes(String(slug || "").toLowerCase());
}

export function isKeepActingDriverCity(slug) {
  return KEEP_ACTING_DRIVER_CITY_SLUGS.includes(String(slug || "").toLowerCase());
}

export function isKeepRankingServicePage(service, city) {
  const svc = String(service || "");
  const citySlug = String(city || "").toLowerCase();
  return KEEP_RANKING_SERVICE_PAGES.some((row) => row.service === svc && row.city === citySlug);
}

export function isKeepRouteSlug(slug) {
  const value = String(slug || "").toLowerCase();
  if (KEEP_ROUTE_SLUGS.includes(value)) return true;
  return value === "chennai-to-bengaluru-cab";
}

/** 301 target for a dropped SEO URL, or null if the path should stay live. */
export function resolveDroppedSeoRedirect(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);

  if (parts[0] === "services" && parts[1] && parts[2]) {
    if (isPackageDoorwayService(parts[1])) return packageDoorwayCanonicalPath(parts[1], parts[2]);
    if (parts[1] === "airport-taxi") {
      return isKeepAirportCity(parts[2]) ? airportCabBookingPath(parts[2]) : "/cabs";
    }
    if (isKeepRankingServicePage(parts[1], parts[2])) return null;
    return isKeepSeoCity(parts[2]) ? cityCabLandingPath(parts[2]) : "/cabs";
  }

  if (parts[0] === "routes" && parts[1]) {
    if (isKeepRouteSlug(parts[1])) return outstationPathFromLegacySlug(parts[1]) || "/cabs";
    return "/cabs";
  }

  if (parts[0] === "acting-driver" && parts[1]) {
    return isKeepActingDriverCity(parts[1]) ? actingDriverLandingPath(parts[1]) : "/call-driver";
  }

  if (parts.length === 2 && parts[1] === "airport-cab-booking") {
    return isKeepAirportCity(parts[0]) ? null : "/cabs";
  }

  if (parts.length === 2 && parts[1] === "acting-driver") {
    return isKeepActingDriverCity(parts[0]) ? null : "/call-driver";
  }

  if (parts.length >= 2 && parts[1] === "outstation") {
    if (parts.length === 2) {
      return isKeepSeoCity(parts[0]) ? null : "/cabs";
    }
    const parsed = parseOutstationRouteSegment(parts[2]);
    if (parsed && isKeepRouteSlug(parsed.legacySlug) && isKeepSeoCity(parts[0])) return null;
    return "/cabs";
  }

  if (parts.length === 1 && cityBySlug(parts[0])) {
    return isKeepSeoCity(parts[0]) ? null : "/cabs";
  }

  return null;
}
