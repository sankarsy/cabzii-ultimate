import { cityBySlug } from "./cities";
import {
  getRouteLandingBody,
  getServiceLandingBody,
  mergeLandingBody
} from "./landingContent";
import { routeBySlug as staticRouteBySlug, synthesizeRouteFromSlug } from "./routes";
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
    image: service.image || "",
    imageAlt: service.imageAlt || "",
    imageTitle: service.imageTitle || "",
    gallery: Array.isArray(service.gallery) ? service.gallery : [],
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

export async function resolveServiceBySlug(slug) {
  const cms = await fetchSeoServiceBySlug(slug);
  if (cms) {
    if (cms.published === false) return null;
    return mapCmsServiceOnly(cms);
  }
  const staticService = staticServiceBySlug(slug);
  if (staticService) return { ...staticService, source: "static" };
  return null;
}

export async function resolveServiceForCity(serviceSlug, citySlug) {
  const city = cityBySlug(citySlug);
  if (!city) return { service: null, city: null };

  const cms = await fetchSeoServiceBySlug(serviceSlug);
  if (cms) {
    if (cms.published === false) return { service: null, city };
    if (!cms.allCities && Array.isArray(cms.citySlugs) && cms.citySlugs.length) {
      if (!cms.citySlugs.includes(citySlug)) return { service: null, city };
    }
    return { service: cmsServiceToPage(cms, city), city, cmsMeta: cms };
  }

  const staticService = staticServiceBySlug(serviceSlug);
  if (staticService) {
    const body = mergeLandingBody(staticService.body, getServiceLandingBody(staticService, city));
    return { service: { ...staticService, body, source: "static" }, city };
  }

  return { service: null, city };
}

export async function resolveRouteBySlug(slug) {
  const cms = await fetchSeoRouteBySlug(slug);
  if (cms) {
    if (cms.published === false) return null;
    const page = cmsRouteToPage(cms);
    if (page) return page;
  }

  // Only use static/synthesized when no CMS row exists.
  if (!cms) {
    const staticRoute = staticRouteBySlug(slug);
    if (staticRoute) {
      const generated = getRouteLandingBody(staticRoute);
      const body = mergeLandingBody(staticRoute.body, generated);
      return { ...staticRoute, body, source: staticRoute.source || "static" };
    }

    const synthesized = synthesizeRouteFromSlug(slug);
    if (synthesized) {
      const generated = getRouteLandingBody(synthesized);
      const body = mergeLandingBody(synthesized.body, generated);
      return { ...synthesized, body, source: synthesized.source || "synthesized" };
    }
  }

  return null;
}
