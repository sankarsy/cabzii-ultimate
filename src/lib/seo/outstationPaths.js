/**
 * FastTrack-style outstation URLs:
 *   /{pickupCity}/outstation/{from}-to-{to}
 * Legacy Cabzii URLs stay as 301s:
 *   /routes/{from}-to-{to}-cab
 */

import { inferCitySlugFromText, normalizeSeoCitySlug } from "../../config/seo-scope";
import { cityBySlug, displayCityFromSlug, SEO_CITIES } from "./cities";
import { ROUTE_CITY_SLUG_ALIASES } from "./featuredRoutes";

function normalizePlaceCitySlug(raw) {
  const key = normalizeSeoCitySlug(raw);
  return ROUTE_CITY_SLUG_ALIASES[key] || key;
}

export function outstationHubPath(citySlug) {
  return `/${String(citySlug || "").toLowerCase()}/outstation`;
}

export function outstationPath(fromToken, toToken) {
  const from = String(fromToken || "").toLowerCase();
  const to = String(toToken || "").toLowerCase();
  if (!from || !to) return "/routes";
  return `/${from}/outstation/${from}-to-${to}`;
}

export function parseOutstationRouteSegment(routeSegment) {
  const raw = String(routeSegment || "")
    .toLowerCase()
    .replace(/\/+$/, "");
  const match = raw.match(/^([a-z0-9-]+)-to-([a-z0-9-]+)$/);
  if (!match) return null;
  return {
    fromToken: match[1],
    toToken: match[2],
    legacySlug: `${match[1]}-to-${match[2]}-cab`
  };
}

export function parseLegacyRouteSlug(slug) {
  const match = String(slug || "")
    .toLowerCase()
    .match(/^([a-z0-9-]+)-to-([a-z0-9-]+)-cab$/);
  if (!match) return null;
  return { fromToken: match[1], toToken: match[2], slug: `${match[1]}-to-${match[2]}-cab` };
}

export function outstationPathFromLegacySlug(slug) {
  const parsed = parseLegacyRouteSlug(slug);
  if (!parsed) return "";
  return outstationPath(parsed.fromToken, parsed.toToken);
}

/** Canonical public path for a route object or legacy `{from}-to-{to}-cab` slug. */
export function routePublicPath(routeOrSlug) {
  const slug = typeof routeOrSlug === "string" ? routeOrSlug : routeOrSlug?.slug;
  return outstationPathFromLegacySlug(slug) || (slug ? `/routes/${slug}` : "/routes");
}

export function reverseRoutePublicPath(fromCitySlug, toCitySlug) {
  return outstationPath(toCitySlug, fromCitySlug);
}

/** City slug from a typed pickup/drop label (city name, “Chennai, Tamil Nadu”, area + city). */
export function citySlugFromPlaceLabel(label) {
  const inferred = inferCitySlugFromText(label);
  if (inferred && cityBySlug(inferred)) return cityBySlug(inferred).slug;

  const first = String(label || "").split(",")[0].trim().toLowerCase();
  if (!first) return "";
  const dashed = first.replace(/\s+/g, "-");
  const routed = normalizePlaceCitySlug(dashed);
  if (cityBySlug(routed)) return cityBySlug(routed).slug;

  const hay = String(label || "").toLowerCase();
  const cities = [...SEO_CITIES].sort((a, b) => b.name.length - a.name.length);
  for (const city of cities) {
    if (hay.includes(city.name.toLowerCase()) || hay.includes(city.slug)) return city.slug;
  }
  return "";
}

function slugifyPlaceToken(label) {
  return String(label || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Drop slug: known city when possible, otherwise a URL token from the typed place. */
export function destinationSlugFromPlaceLabel(label) {
  const known = citySlugFromPlaceLabel(label);
  if (known) return known;
  const token = slugifyPlaceToken(label);
  if (token.length < 3) return "";
  return displayCityFromSlug(token)?.slug || token;
}

/** `/chennai/outstation/chennai-to-kanchipuram` for outstation city (or place) pairs. */
export function outstationHrefFromTrip(trip = {}) {
  const fromSlug = citySlugFromPlaceLabel(trip.from || trip.city);
  const toSlug = destinationSlugFromPlaceLabel(trip.to);
  if (!fromSlug || !toSlug || fromSlug === toSlug) return "";
  if (!cityBySlug(fromSlug)) return "";
  return outstationPath(fromSlug, toSlug);
}

export function parseLegacyRoutesPathname(pathname) {
  const match = String(pathname || "")
    .toLowerCase()
    .match(/^\/routes\/([a-z0-9-]+)-to-([a-z0-9-]+)-cab\/?$/);
  if (!match) return null;
  return outstationPath(match[1], match[2]);
}
