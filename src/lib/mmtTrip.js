import { appendTripCoords, readTripCoords } from "./tripCoords";
import { todayStr as istTodayStr } from "./istDate";
import { citySlugFromPlaceLabel, outstationHrefFromTrip } from "./seo/outstationPaths";
import { airportTaxiPublicPath, cityCabLandingPath } from "./cityCabPaths";
import { num } from "./cabFare";

/** Trip search params for cabzii.in cab booking flow. */

export const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly Rentals" },
  { id: "local", label: "Local" }
];

export const HOURLY_PACKAGES = [
  { hours: 4, label: "4 Hours / 40 km" },
  { hours: 5, label: "5 Hours / 50 km" },
  { hours: 8, label: "8 Hours / 80 km" },
  { hours: 10, label: "10 Hours / 100 km" },
  { hours: 12, label: "12 Hours / 120 km" },
  { hours: 15, label: "15 Hours / 150 km" }
];

export function todayStr() {
  return istTodayStr();
}

function localHoursForTrip(trip) {
  const kind = String(trip?.tripType || "").toLowerCase();
  if (kind === "hourly") return num(trip?.packageHours, 8);
  return 4;
}

export function cabPackageIdFromTrip(trip) {
  if (trip?.packageId || trip?.package) return trip.packageId || trip.package;
  if (trip?.tripType === "outstation") {
    return trip.roundTrip ? "outstation_twoway" : "outstation_oneway";
  }
  if (trip?.tripType === "hourly") {
    const h = num(trip?.packageHours, 8);
    if (h > 12) return "local_15hr";
    if (h > 7 && h !== 8) return "local_10hr";
    if (h <= 4) return "local_4hr";
    if (h === 5) return "local_5hr";
    return "local_1day";
  }
  return "local_4hr";
}

export function parseTripSearchParams(searchParams) {
  const get = (key) => {
    const v = searchParams?.get?.(key) ?? searchParams?.[key];
    return Array.isArray(v) ? v[0] : v ?? "";
  };

  const tripTypeRaw = get("serviceTripType") || get("tripType") || get("service") || "outstation";
  const tripType = ["outstation", "airport", "hourly", "local"].includes(String(tripTypeRaw).toLowerCase())
    ? String(tripTypeRaw).toLowerCase()
    : "outstation";
  const from = get("from") || get("pickup") || "";
  const to = get("to") || get("drop") || "";
  const date = get("date") || todayStr();
  const time = get("time") || "09:00";
  const roundTrip = get("roundTrip") === "true";
  const direction = get("direction") || "pickup";
  const packageHoursRaw = Number(get("packageHours"));
  const packageHours =
    tripType === "hourly" ? packageHoursRaw || 8 : packageHoursRaw > 0 ? packageHoursRaw : undefined;
  const city = get("city") || "";
  const packageId =
    get("packageId") || get("package") || cabPackageIdFromTrip({ tripType, roundTrip, packageHours });

  return {
    tripType,
    from,
    to,
    date,
    time,
    roundTrip,
    direction,
    packageHours,
    packageId,
    city,
    ...readTripCoords(get)
  };
}

export function tripNeedsDrop(tripType) {
  return tripType === "outstation" || tripType === "airport";
}

export function isValidTripSearch(trip) {
  if (!trip?.from?.trim()) return false;
  if (tripNeedsDrop(trip.tripType) && !trip?.to?.trim()) return false;
  return true;
}

/** Outstation city pairs use `/chennai/outstation/chennai-to-kanchipuram`. Other trips stay on /cabs/results. */
export function cabResultsHref(trip) {
  const type = String(trip?.tripType || "").toLowerCase();
  if (type === "outstation") {
    const pretty = outstationHrefFromTrip(trip);
    if (pretty) return pretty;
    const fromSlug = citySlugFromPlaceLabel(trip?.from || trip?.city);
    if (fromSlug && !String(trip?.to || "").trim()) return `/services/outstation-cab/${fromSlug}`;
  }
  if (type === "airport") {
    const slug = citySlugFromPlaceLabel(trip?.from || trip?.to || trip?.city);
    const toSlug = citySlugFromPlaceLabel(trip?.to);
    if (slug && (!String(trip?.to || "").trim() || toSlug === slug)) return airportTaxiPublicPath(slug);
  }
  if (type === "local") {
    const slug = citySlugFromPlaceLabel(trip?.from || trip?.city);
    if (slug) return cityCabLandingPath(slug);
  }
  return `/cabs/results?${tripToSearchQuery(trip).toString()}`;
}

/** Pretty path for `/cabs/results?...` when the trip is a known city pair / hub. */
export function prettyPublicCabRedirect(searchParams) {
  const trip = parseTripSearchParams(searchParams);
  const href = cabResultsHref(trip);
  if (!href || href.startsWith("/cabs/results")) return "";
  return href;
}

export function tripToSearchQuery(trip) {
  const params = new URLSearchParams();
  params.set("serviceTripType", trip.tripType);
  if (trip.from) params.set("from", trip.from);
  if (trip.to) params.set("to", trip.to);
  if (trip.date) params.set("date", trip.date);
  if (trip.time) params.set("time", trip.time);
  if (trip.roundTrip) params.set("roundTrip", "true");
  if (trip.direction) params.set("direction", trip.direction);
  if (trip.tripType === "hourly" && trip.packageHours) {
    params.set("packageHours", String(trip.packageHours));
  }
  if (trip.packageId) params.set("packageId", trip.packageId);
  if (trip.city) params.set("city", trip.city);
  appendTripCoords(params, trip);
  return params;
}

/** Deep-link to hourly cab search (e.g. Bangalore airport 12-hour package). */
export function hourlyCabSearchHref({
  city = "Bengaluru",
  hours = 12,
  pickup = "",
  date,
  time = "09:00"
} = {}) {
  const trip = {
    tripType: "hourly",
    from: pickup || city,
    to: city,
    city,
    packageHours: hours,
    date: date || todayStr(),
    time,
    roundTrip: false,
    direction: "pickup"
  };
  return `/cabs/results?${tripToSearchQuery(trip).toString()}`;
}

/** Kempegowda (BLR) airport pickup · 12 hr / 120 km package. */
export function bangaloreAirport12HrSearchHref() {
  return hourlyCabSearchHref({
    city: "Bengaluru",
    hours: 12,
    pickup: "Kempegowda International Airport, Bengaluru"
  });
}

export function tripTypeLabel(trip) {
  const map = {
    outstation: "Outstation Cab",
    airport: "Airport Transfer",
    hourly: "Hourly Rental",
    local: "Local Cab"
  };
  return map[trip.tripType] || "Cab Booking";
}

export function tripSummaryLabel(trip) {
  if (trip.tripType === "hourly") {
    return `${trip.from || "City"} · ${trip.packageHours}hr package · ${trip.date}`;
  }
  if (trip.tripType === "airport") {
    return `${trip.from} → ${trip.to} · Airport · ${trip.date} ${trip.time}`;
  }
  const rt = trip.roundTrip ? "Round trip" : "One way";
  return `${trip.from} → ${trip.to} · ${rt} · ${trip.date} ${trip.time}`;
}

function isLocalSlab(slab) {
  const id = String(slab?.id || slab?.packageType || "");
  const group = String(slab?.group || "");
  return group === "local" || id.includes("local") || id.includes("airport") || id === "hourly";
}

function slabPrice(slab) {
  return num(slab?.price) > 0 ? num(slab.price) : num(slab?.originalPrice) || num(slab?.list);
}

/** Pick fare slab for search results / passenger page (shared with result cards). */
export function cabSlabForTrip(slabs, trip) {
  if (!slabs?.length) return null;
  const tripType = String(trip?.tripType || "").toLowerCase();
  const packageId = cabPackageIdFromTrip(trip);
  const byPackage = slabs.find((s) => s.id === packageId && slabPrice(s) > 0);
  if (byPackage) return byPackage;

  if (tripType === "outstation") {
    return trip.roundTrip
      ? slabs.find((s) => s.id === "outstation_twoway") || slabs.find((s) => s.group === "outstation") || slabs[0]
      : slabs.find((s) => s.id === "outstation_oneway") || slabs.find((s) => s.group === "outstation") || slabs[0];
  }

  const local = slabs.filter(isLocalSlab);
  const priced = local.filter((s) => slabPrice(s) > 0);
  const pool = priced.length ? priced : local;
  const byHours = (hours) => pool.find((s) => num(s.includedHours) === hours);
  const h = localHoursForTrip(trip);
  if (h > 12 && byHours(15)) return byHours(15);
  if (h > 7 && byHours(10)) return byHours(10);
  if (h > 4 && byHours(8)) return byHours(8);
  if (h <= 4 && byHours(4)) return byHours(4);
  if (h <= 5 && byHours(5)) return byHours(5);
  return byHours(4) || byHours(5) || byHours(8) || byHours(10) || byHours(15) || pool[0] || slabs[0];
}

export function tripToCabziiSearchParams(trip) {
  const routeMap = {
    outstation: "Outstation",
    airport: "Airport",
    hourly: "Rental",
    local: "Local"
  };
  const params = new URLSearchParams();
  params.set("routeType", routeMap[trip.tripType] || "Outstation");
  if (trip.from) params.set("pickup", trip.from);
  if (trip.to) params.set("drop", trip.to);
  if (trip.date) params.set("date", trip.date);
  if (trip.city) params.set("city", trip.city);
  if (trip.roundTrip) params.set("tripType", "Round Trip");
  else if (trip.tripType === "outstation") params.set("tripType", "One Way");
  return params;
}
