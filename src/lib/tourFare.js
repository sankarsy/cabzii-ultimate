import { num, packageYouPay } from "./cabFare";
import { normalizeCityName } from "./tamilNaduCities";
import { SEO_CITIES } from "./seo/cities";
import { lookupRouteTripData } from "./seo/routeCatalog";

export const MIN_TOUR_PERSONS = 1;
export const MAX_TOUR_PERSONS = 30;
/** Package list prices assume round-trip transport from this hub when pickup differs from destination. */
export const DEFAULT_TOUR_ORIGIN_CITY = "Chennai";

const CITY_NAME_TO_SLUG = {
  bangalore: "bengaluru",
  bengaluru: "bengaluru",
  tiruchirappalli: "trichy",
  tiruchy: "trichy",
  trichy: "trichy",
  udhagamandalam: "ooty",
  udhagai: "ooty",
  ooty: "ooty",
  pondicherry: "pondicherry",
  puducherry: "pondicherry",
  tuticorin: "thoothukudi",
  thoothukudi: "thoothukudi",
  tanjore: "thanjavur",
  thanjavur: "thanjavur",
  kovai: "coimbatore",
  coimbatore: "coimbatore",
  madras: "chennai",
  chennai: "chennai"
};

export function cityNameToSlug(name) {
  const normalized = normalizeCityName(name);
  const lower = String(normalized || name || "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  if (!lower) return "";
  if (CITY_NAME_TO_SLUG[lower]) return CITY_NAME_TO_SLUG[lower];

  const exact = SEO_CITIES.find((c) => c.name.toLowerCase() === lower || c.slug === lower);
  if (exact) return exact.slug;

  const partial = SEO_CITIES.find(
    (c) => lower.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(lower)
  );
  if (partial) return partial.slug;

  return lower.replace(/\s+/g, "-");
}

export function resolveTourDestinationCity(pkg) {
  const fromCity = normalizeCityName(pkg?.city || pkg?.location || "");
  if (fromCity) return fromCity;
  const destPart = String(pkg?.destination || "")
    .split(/[–—\-,/]/)[0]
    .trim();
  return normalizeCityName(destPart);
}

function oneWayRouteFare(fromSlug, toSlug) {
  if (!fromSlug || !toSlug || fromSlug === toSlug) return { fare: 0, km: 0 };
  const data = lookupRouteTripData(fromSlug, toSlug);
  const km = Math.max(0, Math.round(num(data?.km)));
  const fare = Math.max(0, Math.round(num(data?.sedan) || km * 12.5));
  return { fare, km };
}

function roundTripRouteFare(fromSlug, toSlug) {
  const { fare, km } = oneWayRouteFare(fromSlug, toSlug);
  return { fare: fare * 2, km };
}

/** Extra round-trip transport vs pricing hub when pickup city is farther/different. */
export function resolveTourTransportAdjustment(pickupCityName, pkg, cabMultiplier = 1) {
  const destName = resolveTourDestinationCity(pkg);
  const pickupSlug = cityNameToSlug(pickupCityName);
  const destSlug = cityNameToSlug(destName);
  const originCity = pkg?.pricingOriginCity || DEFAULT_TOUR_ORIGIN_CITY;
  const anchorSlug = cityNameToSlug(originCity);
  const mult = num(cabMultiplier, 1) > 0 ? num(cabMultiplier, 1) : 1;

  if (!pickupSlug || !destSlug || pickupSlug === destSlug) {
    return {
      adjustment: 0,
      distanceKm: 0,
      pickupCity: normalizeCityName(pickupCityName),
      destinationCity: destName,
      originCity: normalizeCityName(originCity)
    };
  }

  const pickupTrip = roundTripRouteFare(pickupSlug, destSlug);
  const anchorTrip = roundTripRouteFare(anchorSlug, destSlug);
  const adjustment = Math.max(0, Math.round(pickupTrip.fare * mult - anchorTrip.fare * mult));

  return {
    adjustment,
    distanceKm: pickupTrip.km,
    pickupCity: normalizeCityName(pickupCityName),
    destinationCity: destName,
    originCity: normalizeCityName(originCity)
  };
}

export function clampTourPersons(value) {
  const n = Math.floor(num(value, 1));
  return Math.min(MAX_TOUR_PERSONS, Math.max(MIN_TOUR_PERSONS, n));
}

/** Flat package fare; cabMultiplier adjusts for vehicle type. persons is group size only. */
export function calculateTourTotals(
  packagePrice,
  persons,
  discountPct,
  cabMultiplier = 1,
  transportAdjustment = 0
) {
  const mult = num(cabMultiplier, 1) > 0 ? num(cabMultiplier, 1) : 1;
  const transportListPrice = Math.round(num(transportAdjustment));
  const packageListPrice = Math.round(num(packagePrice) * mult);
  const listSubtotal = packageListPrice + transportListPrice;
  const count = clampTourPersons(persons);
  const d = Math.min(99, Math.max(0, num(discountPct)));
  const total = packageYouPay(listSubtotal, d);
  const discountAmount = Math.max(0, listSubtotal - total);

  return {
    persons: count,
    packageListPrice,
    transportListPrice,
    listSubtotal,
    /** @deprecated use listSubtotal */
    packageList: listSubtotal,
    packagePay: total,
    /** @deprecated use listSubtotal */
    listTotal: listSubtotal,
    total,
    discountPct: d,
    discountAmount,
    perPersonList: listSubtotal,
    perPersonPay: total,
    /** @deprecated use transportListPrice */
    transportAdjustment: transportListPrice,
    cabMultiplier: mult
  };
}

export function tourSelectionFromTotals(
  pkg,
  totals,
  { pickup = "", date = "", cabType = "", cabLabel = "", cabMultiplier = 1, transport = null } = {}
) {
  return {
    breakdownType: "tour",
    packageLabel: pkg?.name || "Holiday package",
    serviceTab: "tour",
    cabType,
    cabLabel,
    cabMultiplier: totals.cabMultiplier ?? cabMultiplier,
    packageListPrice: totals.packageListPrice,
    transportListPrice: totals.transportListPrice,
    listSubtotal: totals.listSubtotal,
    listPrice: totals.listSubtotal,
    discountPct: totals.discountPct,
    discountAmount: totals.discountAmount,
    baseFare: totals.total,
    fare: totals.total,
    taxes: 0,
    total: totals.total,
    persons: totals.persons,
    perPersonPay: totals.perPersonPay,
    pickup,
    date,
    transportFrom: transport?.pickupCity || "",
    transportTo: transport?.destinationCity || "",
    transportDistanceKm: transport?.distanceKm || 0,
    pricingOriginCity: transport?.originCity || pkg?.pricingOriginCity || DEFAULT_TOUR_ORIGIN_CITY
  };
}

export function buildTourPaymentParams(pkgId, { totals, pickup, date, cabType, cabLabel, transport, slug }) {
  const q = new URLSearchParams({
    type: "tour",
    id: String(pkgId),
    baseFare: String(totals.total),
    taxes: "0",
    total: String(totals.total),
    listPrice: String(totals.listSubtotal),
    discountPct: String(totals.discountPct),
    discountAmount: String(totals.discountAmount),
    persons: String(totals.persons),
    packageListPrice: String(totals.packageListPrice),
    transportListPrice: String(totals.transportListPrice)
  });
  if (slug) q.set("slug", String(slug));
  if (pickup?.trim()) q.set("pickup", pickup.trim());
  if (date?.trim()) q.set("date", date.trim());
  if (cabType) q.set("cabType", cabType);
  if (cabLabel) q.set("cabLabel", cabLabel);
  if (transport?.pickupCity) q.set("transportFrom", transport.pickupCity);
  if (transport?.destinationCity) q.set("transportTo", transport.destinationCity);
  if (transport?.distanceKm > 0) q.set("transportKm", String(transport.distanceKm));
  return q;
}
