/**
 * FastTrack-style outstation URLs:
 *   /{pickupCity}/outstation/{from}-to-{to}
 * Legacy Cabzii URLs stay as 301s:
 *   /routes/{from}-to-{to}-cab
 */

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

export function parseLegacyRoutesPathname(pathname) {
  const match = String(pathname || "")
    .toLowerCase()
    .match(/^\/routes\/([a-z0-9-]+)-to-([a-z0-9-]+)-cab\/?$/);
  if (!match) return null;
  return outstationPath(match[1], match[2]);
}
