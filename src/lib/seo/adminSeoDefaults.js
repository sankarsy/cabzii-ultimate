/**
 * Description + keywords shown in admin for keep-city pages when CMS is empty.
 * Live templates use the same hub files. Save in admin to store an override.
 */
import { cityHubSeo } from "../../data/cityHubSeo";
import { ACTING_DRIVER_HUB_SEO } from "../../data/actingDriverHubSeo";
import { airportHubSeo } from "../../data/airportHubSeo";
import { serviceCitySeo } from "../../data/serviceCitySeo";
import { cityBySlug } from "./cities";
import { serviceBySlug } from "./services";
import { routeBySlug } from "./routes";
import { clampDescription } from "./programmaticMeta";
import {
  tunedActingDriverDescription,
  tunedActingDriverKeywords,
  tunedActingDriverTitle,
  tunedCabBookingDescription,
  tunedCabBookingKeywords,
  tunedCabBookingTitle,
  tunedRouteDescription,
  tunedRouteKeywords,
  tunedRouteTitle,
  tunedServiceDescription,
  tunedServiceKeywords,
  tunedServiceTitle
} from "./metadataTuning";

function joinKeywords(value, max = 6) {
  const list = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
  return list.slice(0, max).join(", ");
}

function pack({ title, description, keywords }) {
  return {
    seoTitle: String(title || "").trim(),
    seoDescription: clampDescription(description),
    seoKeywords: joinKeywords(keywords)
  };
}

export function programmaticPageSeoDefaults(page) {
  const city = cityBySlug(page.citySlug);

  if (page.pageType === "airport-cab-booking" || (page.typeLabel === "Airport cab" && page.citySlug)) {
    const hub = airportHubSeo(page.citySlug);
    if (hub) return pack({ title: hub.title, description: hub.description, keywords: hub.keywords });
  }

  if (page.type === "city" || page.pageType === "cab-booking") {
    const hub = cityHubSeo(page.citySlug);
    if (hub) return pack({ title: hub.title, description: hub.description, keywords: hub.keywords });
    if (city) {
      return pack({
        title: tunedCabBookingTitle(city),
        description: tunedCabBookingDescription(city),
        keywords: tunedCabBookingKeywords(city)
      });
    }
  }

  if (page.type === "acting-driver") {
    const hub = ACTING_DRIVER_HUB_SEO[page.citySlug];
    if (hub) return pack({ title: hub.title, description: hub.description, keywords: hub.keywords });
    if (city) {
      return pack({
        title: tunedActingDriverTitle(city),
        description: tunedActingDriverDescription(city),
        keywords: tunedActingDriverKeywords(city)
      });
    }
  }

  if (page.type === "service" && city) {
    const service = serviceBySlug(page.serviceSlug);
    const seeded = serviceCitySeo(page.citySlug, page.serviceSlug);
    if (seeded) {
      return pack({
        title: service ? tunedServiceTitle(service, city) : page.title,
        description: seeded.description,
        keywords: seeded.keywords
      });
    }
    if (service) {
      return pack({
        title: tunedServiceTitle(service, city),
        description: tunedServiceDescription(service, city),
        keywords: tunedServiceKeywords(service, city)
      });
    }
  }

  if (page.type === "route" && page.routeSlug) {
    const route = routeBySlug(page.routeSlug);
    if (route) {
      return pack({
        title: tunedRouteTitle(route),
        description: tunedRouteDescription(route),
        keywords: tunedRouteKeywords(route)
      });
    }
  }

  return pack({ title: page.title || "", description: "", keywords: "" });
}
