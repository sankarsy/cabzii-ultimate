import { cityBySlug } from "./seo/cities";
import { lookupRouteTripData } from "./seo/routeCatalog";
import { driverTripToSearchQuery } from "./driverTrip";
import { todayStr, tripToSearchQuery } from "./mmtTrip";

/** Parse km from route row or lookup hub matrix (e.g. Chennai → Tirupati ≈ 135 km). */
export function parseRouteDistanceKm(route) {
  if (route?.distanceKm > 0) return Number(route.distanceKm);
  const fromText = String(route?.distance || "");
  const match = fromText.match(/(\d+)/);
  if (match) return Number(match[1]);

  const fromSlug = route?.from || route?.fromCitySlug || route?.fromCity?.slug;
  const toSlug = route?.to || route?.toCitySlug || route?.toCity?.slug;
  if (fromSlug && toSlug) {
    const data = lookupRouteTripData(fromSlug, toSlug);
    if (data?.km > 0) return data.km;
  }
  return 0;
}

/**
 * Build a cab/driver search URL from a route row ({ from, to } slugs or fromCity/toCity objects).
 * Defaults: outstation · one way · today · 09:00 · outstation_oneway package.
 */
export function routeToTrip(route, { roundTrip = false } = {}) {
  const fromSlug = route.from || route.fromCitySlug || route.fromCity?.slug;
  const toSlug = route.to || route.toCitySlug || route.toCity?.slug;
  const fromCity = route.fromCity || cityBySlug(fromSlug);
  const toCity = route.toCity || cityBySlug(toSlug);
  const fromName = fromCity?.name || fromSlug || "";
  const toName = toCity?.name || toSlug || "";
  const distanceKm = parseRouteDistanceKm(route);

  return {
    tripType: "outstation",
    from: fromName,
    to: toName,
    date: todayStr(),
    time: "09:00",
    roundTrip,
    direction: "pickup",
    packageHours: 8,
    packageId: roundTrip ? "outstation_twoway" : "outstation_oneway",
    city: fromName,
    ...(distanceKm > 0 ? { distanceKm } : {})
  };
}

export function routeToCabSearchHref(route, options) {
  const trip = routeToTrip(route, options);
  return `/cabs/results?${tripToSearchQuery(trip).toString()}`;
}

export function routeToDriverSearchHref(route, options) {
  const trip = routeToTrip(route, options);
  return `/drivers/results?${driverTripToSearchQuery(trip).toString()}`;
}

/** Home hero modify link — prefills search widget */
export function tripToHomeHref(trip, tab = "cabs") {
  const params = tab === "drivers" ? driverTripToSearchQuery(trip) : tripToSearchQuery(trip);
  params.set("tab", tab);
  return `/?${params.toString()}`;
}
