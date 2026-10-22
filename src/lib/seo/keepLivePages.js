/**
 * Keep only allowlisted city/service/route SEO landings.
 * Extra programmatic URLs 301 away so the catalog cannot grow a thin farm.
 */
import {
  isSeoScopeAirportCity,
  isSeoScopeCity,
  isSeoScopeRoute,
  normalizeSeoCitySlug,
  SEO_SCOPE_AIRPORT_CITY_SLUGS,
  SEO_SCOPE_CITY_SLUGS,
  SEO_SCOPE_SERVICES
} from "../../config/seo-scope";
import { cityBySlug } from "./cities";
import { isPackageDoorwayService, packageDoorwayCanonicalPath } from "./packageDoorways";
import {
  actingDriverLandingPath,
  airportCabBookingPath,
  cityCabLandingPath,
  isAirportCabBookingCity
} from "../cityCabPaths";
import { outstationPathFromLegacySlug, parseLegacyRouteSlug, parseOutstationRouteSegment } from "./outstationPaths";

export const KEEP_SEO_CITY_SLUGS = SEO_SCOPE_CITY_SLUGS;
export const KEEP_AIRPORT_CITY_SLUGS = SEO_SCOPE_AIRPORT_CITY_SLUGS;
export const KEEP_ACTING_DRIVER_CITY_SLUGS = SEO_SCOPE_CITY_SLUGS;
export const KEEP_RANKING_SERVICE_PAGES = SEO_SCOPE_CITY_SLUGS.flatMap((city) =>
  SEO_SCOPE_SERVICES.map((service) => ({ service, city }))
);
export const KEEP_ROUTE_SLUGS = ["chennai-to-tirupati-cab"];

export function isKeepSeoCity(slug) {
  return isSeoScopeCity(slug);
}

export function isKeepAirportCity(slug) {
  return isSeoScopeAirportCity(slug);
}

export function isKeepActingDriverCity(slug) {
  return isSeoScopeCity(slug);
}

export function isKeepRankingServicePage(service, city) {
  const svc = String(service || "");
  const citySlug = normalizeSeoCitySlug(city);
  if (!SEO_SCOPE_SERVICES.includes(svc)) return false;
  if (svc === "airport-taxi" && !isSeoScopeAirportCity(citySlug)) return false;
  return isSeoScopeCity(citySlug);
}

export function isKeepRouteSlug(slug) {
  const value = String(slug || "").toLowerCase();
  if (KEEP_ROUTE_SLUGS.includes(value)) return true;
  const parsed = parseLegacyRouteSlug(value);
  if (!parsed) return false;
  return isSeoScopeRoute(parsed.fromToken, parsed.toToken);
}

function aliasRedirect(parts) {
  if (!parts.length) return null;
  const canonicalFirst = normalizeSeoCitySlug(parts[0]);
  if (canonicalFirst !== parts[0] && isSeoScopeCity(canonicalFirst)) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${canonicalFirst}/${rest}` : cityCabLandingPath(canonicalFirst);
  }
  if (parts[0] === "cab-booking" && parts[1]) {
    const canonical = normalizeSeoCitySlug(parts[1]);
    if (canonical !== parts[1] && isSeoScopeCity(canonical)) return cityCabLandingPath(canonical);
  }
  if (parts[0] === "acting-driver" && parts[1]) {
    const canonical = normalizeSeoCitySlug(parts[1]);
    if (canonical !== parts[1] && isSeoScopeCity(canonical)) return actingDriverLandingPath(canonical);
  }
  if (parts[0] === "services" && parts[1] && parts[2]) {
    const canonical = normalizeSeoCitySlug(parts[2]);
    if (canonical !== parts[2] && isSeoScopeCity(canonical)) return `/services/${parts[1]}/${canonical}`;
  }
  return null;
}

/** 301 target for a dropped SEO URL, or null if the path should stay live. */
export function resolveDroppedSeoRedirect(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);

  const aliased = aliasRedirect(parts);
  if (aliased) return aliased;

  if (parts[0] === "services" && parts[1] && parts[2]) {
    if (isPackageDoorwayService(parts[1])) return packageDoorwayCanonicalPath(parts[1], parts[2]);
    if (parts[1] === "airport-taxi") {
      if (isAirportCabBookingCity(parts[2])) return airportCabBookingPath(parts[2]);
      return isKeepAirportCity(parts[2]) ? null : "/cabs";
    }
    if (isKeepRankingServicePage(parts[1], parts[2])) return null;
    return isKeepSeoCity(parts[2]) ? cityCabLandingPath(parts[2]) : "/cabs";
  }

  if (parts[0] === "routes" && parts[1]) {
    if (isKeepRouteSlug(parts[1])) return outstationPathFromLegacySlug(parts[1]) || "/cabs";
    return "/cabs";
  }

  if (parts[0] === "cab-booking" && parts[1]) {
    if (isKeepSeoCity(parts[1])) return null;
    if (cityBySlug(parts[1])) return "/cabs";
    return "/cabs";
  }

  if (parts[0] === "acting-driver" && parts[1]) {
    return isKeepActingDriverCity(parts[1]) ? null : "/call-driver";
  }

  if (parts.length === 2 && parts[1] === "airport-cab-booking") {
    if (isAirportCabBookingCity(parts[0])) return null;
    if (isKeepAirportCity(parts[0])) return `/services/airport-taxi/${parts[0]}`;
    return "/cabs";
  }

  if (parts.length === 2 && parts[1] === "acting-driver") {
    return isKeepActingDriverCity(parts[0]) ? actingDriverLandingPath(parts[0]) : "/call-driver";
  }

  if (parts.length >= 2 && parts[1] === "outstation") {
    if (parts.length === 2) {
      return isKeepSeoCity(parts[0]) ? `/services/outstation-cab/${parts[0]}` : "/cabs";
    }
    const parsed = parseOutstationRouteSegment(parts[2]);
    if (
      parsed &&
      parsed.fromToken === parts[0] &&
      cityBySlug(parsed.fromToken) &&
      parsed.toToken &&
      parsed.toToken !== parsed.fromToken
    ) {
      return null;
    }
    if (parsed && isKeepRouteSlug(parsed.legacySlug) && isKeepSeoCity(parts[0])) return null;
    if (isKeepSeoCity(parts[0])) return `/services/outstation-cab/${parts[0]}`;
    return "/cabs";
  }

  if (parts.length === 1 && cityBySlug(parts[0])) {
    return isKeepSeoCity(parts[0]) ? cityCabLandingPath(parts[0]) : "/cabs";
  }

  return null;
}
