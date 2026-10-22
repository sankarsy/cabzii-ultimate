/**
 * Live ranking URLs — generated from config/seo-scope.js (6 cities).
 * This is not a fixed 45-city spreadsheet.
 */
import { SEO_SCOPE_CITIES, SEO_SCOPE_SERVICES, isSeoScopeAirportCity, isSeoScopeCity, isSeoScopeRoute } from "../../config/seo-scope";
import { cityBySlug } from "./cities";
import { SEO_ROUTES } from "./routes";
import { serviceBySlug, servicePath } from "./services";
import {
  airportCabBookingPath,
  cityCabLandingPath,
  actingDriverLandingPath,
  isAirportCabBookingCity
} from "../cityCabPaths";
import { routePublicPath } from "./outstationPaths";

function liveSeoCities() {
  return SEO_SCOPE_CITIES.map((row) => cityBySlug(row.slug)).filter(Boolean);
}

/**
 * Flat list of live programmatic SEO landing URLs for admin index & sitemap tooling.
 */
export function listProgrammaticSeoPages() {
  const pages = [];

  for (const city of liveSeoCities()) {
    pages.push({
      id: `city:${city.slug}`,
      type: "city",
      typeLabel: "City hub",
      title: `Cab booking ${city.name}`,
      path: cityCabLandingPath(city.slug),
      citySlug: city.slug,
      pageType: "cab-booking",
      adminTab: "seoPagesHub",
      cmsKey: `cab-booking:${city.slug}`
    });

    pages.push({
      id: `acting-driver:${city.slug}`,
      type: "acting-driver",
      typeLabel: "Acting driver",
      title: `Acting driver ${city.name}`,
      path: actingDriverLandingPath(city.slug),
      citySlug: city.slug,
      pageType: "acting-driver",
      adminTab: "seoPagesHub",
      cmsKey: `acting-driver:${city.slug}`
    });

    if (isAirportCabBookingCity(city.slug)) {
      pages.push({
        id: `airport:${city.slug}`,
        type: "city",
        typeLabel: "Airport cab",
        title: `${city.name} airport cab booking`,
        path: airportCabBookingPath(city.slug),
        citySlug: city.slug,
        pageType: "airport-cab-booking",
        adminTab: "seoPagesHub",
        cmsKey: `airport-cab-booking:${city.slug}`
      });
    }

    for (const serviceSlug of SEO_SCOPE_SERVICES) {
      const service = serviceBySlug(serviceSlug);
      if (!service) continue;
      if (service.slug === "airport-taxi" && (isAirportCabBookingCity(city.slug) || !isSeoScopeAirportCity(city.slug))) continue;
      pages.push({
        id: `service:${service.slug}:${city.slug}`,
        type: "service",
        typeLabel: "Service × city",
        title: `${service.name} — ${city.name}`,
        path: servicePath(service, city),
        citySlug: city.slug,
        serviceSlug: service.slug,
        adminTab: service.slug === "airport-taxi" ? "airportTaxi" : "cmsServices",
        cmsKey: service.slug
      });
    }
  }

  for (const route of SEO_ROUTES) {
    if (!isSeoScopeRoute(route.from, route.to)) continue;
    const fromCity = cityBySlug(route.from);
    const toCity = cityBySlug(route.to);
    pages.push({
      id: `route:${route.slug}`,
      type: "route",
      typeLabel: "Route",
      title: `${fromCity?.name || route.from} → ${toCity?.name || route.to}`,
      path: routePublicPath(route.slug),
      routeSlug: route.slug,
      citySlug: route.from,
      fromCitySlug: route.from,
      toCitySlug: route.to,
      adminTab: "seoRoutes",
      cmsKey: route.slug
    });
  }

  return pages;
}

export const PROGRAMMATIC_SEO_PAGE_COUNT = listProgrammaticSeoPages().length;

/** Generated Pages admin tab — keep-city hubs only, merged with saved CMS rows. */
export function mergeStaticSeoCityPages(cmsItems = []) {
  const liveCms = (cmsItems || []).filter((row) => isSeoScopeCity(row.citySlug));
  const cmsKeys = new Set(liveCms.map((row) => `${row.pageType}:${String(row.citySlug || "").toLowerCase()}`));
  const staticRows = listProgrammaticSeoPages()
    .filter((page) => page.type === "city" || page.type === "acting-driver")
    .filter((page) => !cmsKeys.has(page.cmsKey))
    .map((page) => ({
      _id: `static:${page.cmsKey}`,
      id: `static:${page.cmsKey}`,
      pageType: page.pageType,
      citySlug: page.citySlug,
      seoTitle: page.title,
      published: true,
      isStatic: true,
      source: "static",
      publicPath: page.path
    }));
  return [...liveCms, ...staticRows];
}
