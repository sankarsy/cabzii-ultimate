import { appendTripCoords, readTripCoords } from "./tripCoords";

/** Trip search params for cabzii.in cab booking flow. */

export const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly Rentals" },
  { id: "local", label: "Local" }
];

export const HOURLY_PACKAGES = [
  { hours: 4, label: "4 Hours / 40 km" },
  { hours: 8, label: "8 Hours / 80 km" },
  { hours: 12, label: "12 Hours / 120 km" }
];

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function cabPackageIdFromTrip(trip) {
  if (trip?.packageId || trip?.package) return trip.packageId || trip.package;
  if (trip?.tripType === "outstation") {
    return trip.roundTrip ? "outstation_twoway" : "outstation_oneway";
  }
  if (trip?.tripType === "hourly") {
    const h = Number(trip.packageHours) || 8;
    return h <= 4 ? "local_4hr" : "local_1day";
  }
  if (trip?.tripType === "airport" || trip?.tripType === "local") {
    return "local_4hr";
  }
  return "local_4hr";
}

export function parseTripSearchParams(searchParams) {
  const get = (key) => {
    const v = searchParams?.get?.(key) ?? searchParams?.[key];
    return Array.isArray(v) ? v[0] : v ?? "";
  };

  const tripType = get("serviceTripType") || get("tripType") || "outstation";
  const from = get("from") || get("pickup") || "";
  const to = get("to") || get("drop") || "";
  const date = get("date") || todayStr();
  const time = get("time") || "09:00";
  const roundTrip = get("roundTrip") === "true";
  const direction = get("direction") || "pickup";
  const packageHours = Number(get("packageHours")) || 8;
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

export function tripToSearchQuery(trip) {
  const params = new URLSearchParams();
  params.set("serviceTripType", trip.tripType);
  if (trip.from) params.set("from", trip.from);
  if (trip.to) params.set("to", trip.to);
  if (trip.date) params.set("date", trip.date);
  if (trip.time) params.set("time", trip.time);
  if (trip.roundTrip) params.set("roundTrip", "true");
  if (trip.direction) params.set("direction", trip.direction);
  if (trip.packageHours) params.set("packageHours", String(trip.packageHours));
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

/** Pick fare slab for search results / passenger page (shared with result cards). */
export function cabSlabForTrip(slabs, trip) {
  if (!slabs?.length) return null;
  const packageId = cabPackageIdFromTrip(trip);
  const byPackage = slabs.find((s) => s.id === packageId);
  if (byPackage) return byPackage;
  if (trip.tripType === "hourly") {
    return slabs.find((s) => s.group === "local") || slabs[0];
  }
  if (trip.tripType === "airport" || trip.tripType === "local") {
    return slabs.find((s) => s.id === "local_4hr") || slabs.find((s) => s.group === "local") || slabs[0];
  }
  if (trip.tripType === "outstation") {
    return trip.roundTrip
      ? slabs.find((s) => s.id === "outstation_twoway") || slabs.find((s) => s.group === "outstation") || slabs[0]
      : slabs.find((s) => s.id === "outstation_oneway") || slabs.find((s) => s.group === "outstation") || slabs[0];
  }
  return slabs[0];
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
