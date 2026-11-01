import { cityBySlug, MAIN_PAGE_CITY_SLUGS } from "./seo/cities";
import { routesForCity } from "./seo/routes";
import { citySlugFromPlaceLabel, outstationHrefFromTrip, outstationPath } from "./seo/outstationPaths";

export function outstationSearchHref(fromName, toName) {
  const pretty = outstationHrefFromTrip({ from: fromName, to: toName, tripType: "outstation" });
  if (pretty) return pretty;
  const fromSlug = citySlugFromPlaceLabel(fromName);
  return fromSlug ? `/services/outstation-cab/${fromSlug}` : "/cabs";
}

/** Outstation destinations from a city — keep-live pages when they exist, else search. */
export function pickOutstationRoutes(citySlug, { direction = "from", limit = 10 } = {}) {
  const origin = cityBySlug(citySlug);
  const originName = origin?.name || citySlug;
  const rows = routesForCity(citySlug)
    .filter((route) => (direction === "from" ? route.from === citySlug : route.to === citySlug))
    .sort((a, b) => {
      const km = (row) => {
        const n = Number(String(row.distance || "").replace(/[^\d.]/g, ""));
        return Number.isFinite(n) && n > 0 ? n : 99999;
      };
      return km(a) - km(b);
    });
  const out = [];
  const seen = new Set();
  for (const route of rows) {
    const otherSlug = direction === "from" ? route.to : route.from;
    if (!route?.slug || !otherSlug || otherSlug === citySlug || seen.has(otherSlug)) continue;
    seen.add(otherSlug);
    const otherName = cityBySlug(otherSlug)?.name || otherSlug;
    out.push({
      href: direction === "from" ? outstationPath(citySlug, otherSlug) : outstationPath(otherSlug, citySlug),
      label: `${originName} to ${otherName}`,
      otherSlug,
      otherName,
      originName,
      distance: route.distance || "",
      duration: route.duration || "",
      sedanFrom: route.sedanFrom || 0,
      suvFrom: route.suvFrom || 0,
      innovaFrom: route.innovaFrom || 0
    });
    if (out.length >= limit) break;
  }
  if (out.length < limit) {
    for (const slug of MAIN_PAGE_CITY_SLUGS) {
      if (slug === citySlug || seen.has(slug)) continue;
      const peer = cityBySlug(slug);
      if (!peer) continue;
      seen.add(slug);
      out.push({
        href: outstationPath(citySlug, slug),
        label: `${originName} to ${peer.name}`,
        otherSlug: peer.slug,
        otherName: peer.name,
        originName,
        distance: "",
        duration: "",
        sedanFrom: 0,
        suvFrom: 0,
        innovaFrom: 0
      });
      if (out.length >= limit) break;
    }
  }
  return out;
}

/** Footer / hub links: origin → other cities only. Never city booking hubs. */
export function popularRouteLinks(citySlug, limit = 8) {
  return (pickOutstationRoutes(citySlug, { direction: "from", limit }) || []).map((route) => ({
    href: route.href,
    label: `${route.originName} → ${route.otherName}`
  }));
}
