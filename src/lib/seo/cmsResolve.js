import { cityBySlug } from "./cities";
import { routeBySlug as staticRouteBySlug } from "./routes";
import { serviceBySlug as staticServiceBySlug } from "./services";
import { fetchSeoRouteBySlug, fetchSeoServiceBySlug } from "../serverCatalog";

export function cmsServiceToPage(service, city) {
  if (!service || !city) return null;
  return {
    slug: service.slug,
    name: service.name,
    primaryKeyword: service.primaryKeyword || service.name,
    searchQuery: service.searchQuery || service.primaryKeyword || service.name,
    priceFrom: Number(service.priceFrom) || 0,
    highlights: Array.isArray(service.highlights) ? service.highlights : [],
    body: service.body || "",
    seoTitle: service.seoTitle || "",
    seoDescription: service.seoDescription || "",
    seo: service.seo || "",
    source: "cms"
  };
}

export function cmsRouteToPage(route) {
  const fromCity = cityBySlug(route.fromCitySlug);
  const toCity = cityBySlug(route.toCitySlug);
  if (!fromCity || !toCity) return null;
  return {
    slug: route.slug,
    from: route.fromCitySlug,
    to: route.toCitySlug,
    fromCity,
    toCity,
    distance: route.distance || "",
    duration: route.duration || "",
    sedanFrom: Number(route.sedanFrom) || 0,
    suvFrom: Number(route.suvFrom) || 0,
    body: route.body || "",
    highlights: Array.isArray(route.highlights) ? route.highlights : [],
    seoTitle: route.seoTitle || "",
    seoDescription: route.seoDescription || "",
    seo: route.seo || "",
    title: route.title,
    source: "cms"
  };
}

export async function resolveServiceBySlug(slug) {
  const cms = await fetchSeoServiceBySlug(slug);
  if (cms && cms.published !== false) return cmsServiceToPage(cms, { slug: "placeholder" }) || mapCmsServiceOnly(cms);
  const staticService = staticServiceBySlug(slug);
  if (staticService) return { ...staticService, source: "static" };
  if (cms) return mapCmsServiceOnly(cms);
  return null;
}

function mapCmsServiceOnly(cms) {
  return {
    slug: cms.slug,
    name: cms.name,
    primaryKeyword: cms.primaryKeyword || cms.name,
    searchQuery: cms.searchQuery || cms.primaryKeyword || cms.name,
    priceFrom: Number(cms.priceFrom) || 0,
    highlights: Array.isArray(cms.highlights) ? cms.highlights : [],
    body: cms.body || "",
    seoTitle: cms.seoTitle || "",
    seoDescription: cms.seoDescription || "",
    seo: cms.seo || "",
    source: "cms"
  };
}

export async function resolveServiceForCity(serviceSlug, citySlug) {
  const city = cityBySlug(citySlug);
  if (!city) return { service: null, city: null };

  const cms = await fetchSeoServiceBySlug(serviceSlug);
  if (cms && cms.published !== false) {
    if (!cms.allCities && Array.isArray(cms.citySlugs) && cms.citySlugs.length) {
      if (!cms.citySlugs.includes(citySlug)) return { service: null, city };
    }
    return { service: cmsServiceToPage(cms, city), city, cmsMeta: cms };
  }

  const staticService = staticServiceBySlug(serviceSlug);
  if (staticService) return { service: { ...staticService, source: "static" }, city };

  return { service: null, city };
}

export async function resolveRouteBySlug(slug) {
  const cms = await fetchSeoRouteBySlug(slug);
  if (cms && cms.published !== false) {
    const page = cmsRouteToPage(cms);
    if (page) return page;
  }
  const staticRoute = staticRouteBySlug(slug);
  if (staticRoute) return { ...staticRoute, source: "static" };
  if (cms) {
    const page = cmsRouteToPage(cms);
    if (page) return page;
  }
  return null;
}
