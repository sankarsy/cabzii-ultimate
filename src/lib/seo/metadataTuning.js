import {
  formatSerpTitle,
  getCabBookingH1,
  getCabBookingMeta,
  getRouteH1,
  getRouteMeta,
  getServiceH1,
  getServiceMeta,
  cabBookingMetaKeywords,
  routeMetaKeywords,
  serviceMetaKeywords
} from "./programmaticMeta";

export { CITY_PRIORITY_SERVICES, serviceSearchHref } from "./programmaticMeta";

/** /cab-booking/{city} */
export function tunedCabBookingTitle(city) {
  return getCabBookingMeta(city).title;
}

export function tunedCabBookingDescription(city) {
  return getCabBookingMeta(city).description;
}

export function tunedCabBookingH1(city) {
  return getCabBookingH1(city);
}

export function tunedCabBookingKeywords(city) {
  return cabBookingMetaKeywords(city);
}

/** /acting-driver/{city} — unchanged intent, length-safe */
export function tunedActingDriverTitle(city) {
  if (city.slug === "tirupati") {
    return formatSerpTitle("Acting Driver Tirupati", "Chauffeur on Hire");
  }
  if (city.slug === "chennai") {
    return formatSerpTitle("Acting Driver in Chennai", "Driver on Hire");
  }
  return formatSerpTitle(`Acting Driver ${city.name}`, "Driver on Hire");
}

export function tunedActingDriverDescription(city) {
  if (city.slug === "chennai") {
    return "Book an acting driver in Chennai for your own car — local, airport chauffeur and outstation highway days. Book on Call Driver; a professional is assigned after you confirm. Not a Cabzii taxi and not self-drive.";
  }
  if (city.slug === "tirupati") {
    return "Acting driver in Tirupati for temple trips and outstation runs. Daily packages and transparent fares on Cabzii.in — book Call Driver after you choose the package.";
  }
  return `Acting driver in ${city.name}, ${city.state} — chauffeur for your own car. Hourly, daily and outstation packages. Book on Cabzii.in.`;
}

export function tunedActingDriverH1(city) {
  if (city.slug === "chennai") return "Acting Driver in Chennai — Driver for Your Own Car";
  return `Acting Driver in ${city.name} — Chauffeur on Hire`;
}

export function tunedActingDriverKeywords(city) {
  const cityLower = city.name.toLowerCase();
  const base = [
    `acting driver in ${cityLower}`,
    `acting driver ${cityLower}`,
    `call driver in ${cityLower}`,
    `driver on hire ${cityLower}`,
    `chauffeur ${cityLower}`,
    "cabzii acting driver"
  ];
  if (city.slug === "chennai") {
    return ["acting driver in chennai", "call driver in chennai", "acting driver chennai", ...base];
  }
  if (city.slug === "tirupati") {
    return ["acting driver tirupati", "driver on hire tirupati", ...base];
  }
  return base;
}

/** /services/{service}/{city} */
export function tunedServiceTitle(service, city) {
  return getServiceMeta(service, city).title;
}

export function tunedServiceDescription(service, city) {
  return getServiceMeta(service, city).description;
}

export function tunedServiceH1(service, city) {
  return getServiceH1(service, city);
}

export function tunedServiceKeywords(service, city) {
  return serviceMetaKeywords(service, city);
}

/** /routes/{slug} */
export function tunedRouteTitle(route) {
  return getRouteMeta(route).title;
}

export function tunedRouteDescription(route) {
  return getRouteMeta(route).description;
}

export function tunedRouteKeywords(route) {
  return routeMetaKeywords(route);
}

export function tunedRouteH1(route) {
  return getRouteH1(route);
}
