import { cityBySlug, SEO_CITIES } from "./cities";
import { SEO_ROUTES } from "./routes";
import { SEO_SERVICES } from "./services";

/**
 * Flat list of all programmatic SEO landing URLs for admin index & sitemap tooling.
 */
export function listProgrammaticSeoPages() {
  const pages = [];

  for (const city of SEO_CITIES) {
    pages.push({
      id: `city:${city.slug}`,
      type: "city",
      typeLabel: "City hub",
      title: `Cab booking ${city.name}`,
      path: `/cab-booking/${city.slug}`,
      citySlug: city.slug,
      pageType: "cab-booking",
      adminTab: "seoCityPages",
      cmsKey: `cab-booking:${city.slug}`
    });

    pages.push({
      id: `acting-driver:${city.slug}`,
      type: "acting-driver",
      typeLabel: "Acting driver",
      title: `Acting driver ${city.name}`,
      path: `/acting-driver/${city.slug}`,
      citySlug: city.slug,
      pageType: "acting-driver",
      adminTab: "seoCityPages",
      cmsKey: `acting-driver:${city.slug}`
    });

    for (const service of SEO_SERVICES) {
      pages.push({
        id: `service:${service.slug}:${city.slug}`,
        type: "service",
        typeLabel: "Service × city",
        title: `${service.name} — ${city.name}`,
        path: `/services/${service.slug}/${city.slug}`,
        citySlug: city.slug,
        serviceSlug: service.slug,
        adminTab: "seoServices",
        cmsKey: service.slug
      });
    }
  }

  for (const route of SEO_ROUTES) {
    const fromCity = cityBySlug(route.from);
    const toCity = cityBySlug(route.to);
    const fromLabel = fromCity?.name || route.from;
    const toLabel = toCity?.name || route.to;

    pages.push({
      id: `route:${route.slug}`,
      type: "route",
      typeLabel: "Route",
      title: `${fromLabel} → ${toLabel}`,
      path: `/routes/${route.slug}`,
      routeSlug: route.slug,
      adminTab: "seoRoutes",
      cmsKey: route.slug
    });
  }

  return pages;
}

export const PROGRAMMATIC_SEO_PAGE_COUNT = listProgrammaticSeoPages().length;
