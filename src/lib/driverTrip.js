import { appendTripCoords, readTripCoords } from "./tripCoords";

/** Hero & results search params for acting driver booking (mirrors cab mmtTrip). */

export const DRIVER_TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly Rentals" },
  { id: "local", label: "Local" }
];

export const DRIVER_HOURLY_PACKAGES = [
  { hours: 4, label: "4 Hours / 40 km" },
  { hours: 8, label: "8 Hours / 80 km" },
  { hours: 12, label: "12 Hours / 120 km" }
];

/** Same ids as driverFare DRIVER_SLAB_META */
export const DRIVER_HERO_PACKAGES = [
  { id: "local_4hr", group: "local", label: "4 Hrs / 40 Km", shortLabel: "4 Hrs / 40 Km" },
  { id: "local_1day", group: "local", label: "8 Hrs / 80 Km", shortLabel: "8 Hrs / 80 Km" },
  { id: "outstation_oneway", group: "outstation", label: "One Way", shortLabel: "One Way" },
  { id: "outstation_twoway", group: "outstation", label: "Two Way", shortLabel: "Two Way" }
];

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function packageIdFromTrip(trip) {
  const explicit = trip?.packageId || trip?.package;
  if (explicit) return explicit;

  if (trip?.tripType === "outstation") {
    return trip.roundTrip ? "outstation_twoway" : "outstation_oneway";
  }
  if (trip?.tripType === "hourly") {
    const h = Number(trip.packageHours) || 8;
    return h <= 4 ? "local_4hr" : "local_1day";
  }
  return "local_4hr";
}

export function parseDriverTripSearchParams(searchParams) {
  const get = (key) => {
    const v = searchParams?.get?.(key) ?? searchParams?.[key];
    return Array.isArray(v) ? v[0] : v ?? "";
  };

  const tripType = get("serviceTripType") || get("tripType") || "outstation";
  const from = get("from") || get("pickup") || get("city") || "";
  const to = get("to") || get("drop") || "";
  const date = get("date") || todayStr();
  const time = get("time") || "09:00";
  const roundTrip = get("roundTrip") === "true";
  const direction = get("direction") || "pickup";
  const packageHours = Number(get("packageHours")) || 8;
  const city = get("city") || from.split(",")[0] || "";
  const packageId =
    get("packageId") || get("package") || packageIdFromTrip({ tripType, roundTrip, packageHours });

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

export function defaultPackageForTrip(tripType, roundTrip = false) {
  return packageIdFromTrip({ tripType, roundTrip });
}

export function driverTripNeedsDrop(tripType) {
  return tripType === "outstation" || tripType === "airport";
}

export function isValidDriverTripSearch(trip) {
  if (!trip?.from?.trim()) return false;
  if (driverTripNeedsDrop(trip.tripType) && !trip?.to?.trim()) return false;
  return true;
}

export function driverTripToSearchQuery(trip) {
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

export function driverTripTypeLabel(trip) {
  const map = {
    outstation: "Outstation Driver",
    airport: "Airport Driver",
    hourly: "Hourly Driver",
    local: "Local Driver"
  };
  return map[trip.tripType] || "Driver Booking";
}

export function driverPackageLabel(packageId) {
  return DRIVER_HERO_PACKAGES.find((p) => p.id === packageId)?.label || "Driver package";
}

/** Pick fare slab for search results / passenger page (mirrors cab result card logic). */
export function driverSlabForTrip(slabs, trip) {
  if (!slabs?.length) return null;
  const byPackage = slabs.find((s) => s.id === packageIdFromTrip(trip));
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

export function driverTripSummaryLabel(trip) {
  if (trip.tripType === "hourly") {
    return `${trip.from || "City"} · ${trip.packageHours}hr package · ${trip.date}`;
  }
  if (trip.tripType === "airport") {
    return `${trip.from} → ${trip.to} · Airport · ${trip.date} ${trip.time}`;
  }
  if (trip.tripType === "outstation" && trip.to) {
    const rt = trip.roundTrip ? "Round trip" : "One way";
    return `${trip.from} → ${trip.to} · ${rt} · ${trip.date} ${trip.time}`;
  }
  return `${trip.from || "City"} · ${driverPackageLabel(trip.packageId)} · ${trip.date} ${trip.time}`;
}
