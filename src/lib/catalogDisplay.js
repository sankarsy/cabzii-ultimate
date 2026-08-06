/** Human-readable cab/driver labels for cards & checkout — not SEO meta titles. */

import { resolvePerKmRate } from "./distanceFare";

const SEO_SUFFIX_RE =
  /\s+(sedan|suv|hatchback|mpv|tempo(?:\s*traveller)?)\s+(car rental|cab rental|taxi booking|booking).*$/i;
const SEO_TAIL_RE =
  /\s+(car rental|cab rental|taxi|booking|hire|rental)(\s+(in|at|for|near))?\s+[\w\s,&-]+$/i;

function cleanRawTitle(raw = "") {
  return String(raw || "")
    .replace(SEO_SUFFIX_RE, "")
    .replace(SEO_TAIL_RE, "")
    .replace(/\s+\|\s+Cabzii\s*$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Short vehicle name, e.g. "Dzire Tour S" — never the full SEO title. */
export function getCabVehicleName(cab = {}) {
  if (cab.vehicleModel?.trim()) return cab.vehicleModel.trim();
  if (cab.brandName?.trim()) return cab.brandName.trim();

  const cleaned = cleanRawTitle(cab.title);
  if (cleaned) return cleaned;

  const type = cab.type?.trim();
  return type || "Cab";
}

function tripServiceLabel(trip) {
  if (!trip) return "";
  if (trip.tripType === "outstation") {
    return trip.roundTrip ? "Round trip" : "One way";
  }
  if (trip.tripType === "airport") return "Airport transfer";
  if (trip.tripType === "hourly") {
    const h = Number(trip.packageHours) || 8;
    return `${h} hr package`;
  }
  if (trip.tripType === "local") return "Local package";
  return "";
}

/** Subtitle for homepage / catalog browse cards (no route pre-fill). */
export function getCabCatalogSubtitle(cab = {}, city = "") {
  const type = cab.type?.trim() || cab.category?.trim() || "Cab";
  const vendor = cab.vendor?.trim() || "Cabzii Partner";
  /* Prefer the cab's registered city so HQ inventory is not overwritten by a browsed city */
  const shown = String(cab.city || "").trim() || String(city || "").trim();
  return shown ? `${type} · ${vendor} · ${shown}` : `${type} · ${vendor}`;
}

/** Title on cards, passenger page & payment — matches the active trip. */
export function getCabDisplayTitle(cab = {}, trip, { includeRoute = true } = {}) {
  const vehicle = getCabVehicleName(cab);
  if (!trip || !includeRoute) return vehicle;

  if (trip.tripType === "outstation" && trip.from && trip.to) {
    return `${vehicle} · ${trip.from} → ${trip.to}`;
  }
  if (trip.tripType === "airport" && trip.from) {
    const dest = trip.to ? ` → ${trip.to}` : "";
    return `${vehicle} · Airport${dest}`;
  }
  if (trip.tripType === "hourly") {
    const city = trip.from || trip.city || "";
    const pkg = tripServiceLabel(trip);
    return city ? `${vehicle} · ${pkg} · ${city}` : `${vehicle} · ${pkg}`;
  }

  const city = trip.from || trip.city || cab.city || "";
  return city ? `${vehicle} · ${city}` : vehicle;
}

/** Subtitle under the title — uses trip city, not the cab's registered SEO city. */
export function getCabDisplaySubtitle(cab = {}, trip) {
  const type = cab.type?.trim() || "Cab";
  const vendor = cab.vendor?.trim() || "Cabzii Partner";
  const city = trip?.city || trip?.from || cab.city || "";
  return city ? `${type} · ${vendor} · ${city}` : `${type} · ${vendor}`;
}

/** Package / fare line for result cards & checkout sidebar. */
export function getCabPackageLine(cab, trip, { slab, fare } = {}) {
  if (fare?.usesDistance) {
    const rt = trip?.roundTrip ? " · Round trip" : "";
    return `₹${fare.perKmRate}/km · ${fare.distanceKm || "?"} km${rt}`;
  }
  const service = tripServiceLabel(trip);
  if (service && slab?.label) return `${service} · ${slab.label}`;
  if (service) return service;
  return slab?.label ? `Package: ${slab.label}` : null;
}

/** Homepage / catalog browse — outstation per-km rate for card price block. */
export function getCatalogPerKmFare(catalogItem, slabs) {
  const outSlab =
    slabs.find((s) => s.id === "outstation_oneway") ||
    slabs.find((s) => s.group === "outstation") ||
    slabs[0];
  const perKmRate = resolvePerKmRate(outSlab, catalogItem);

  return {
    perKmRate,
    fareNote: "per km · one way"
  };
}

function catalogNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Acting driver catalog cards — hourly rate for card price block. */
export function resolveCatalogHourlyRate(driver, slabs) {
  const hourly = catalogNum(driver?.pricing?.hourly);
  if (hourly > 0) return hourly;

  const local4 =
    slabs.find((s) => s.id === "local_4hr") ||
    slabs.find((s) => s.group === "local") ||
    slabs[0];

  if (catalogNum(local4?.extraHr) > 0) return catalogNum(local4.extraHr);

  const pkgHr =
    catalogNum(driver?.farePackages?.local4hr?.extraHourRate) ||
    catalogNum(driver?.farePackages?.local8hr?.extraHourRate) ||
    catalogNum(driver?.pricing?.extraHour);
  if (pkgHr > 0) return pkgHr;

  const pkgPrice = catalogNum(local4?.price) || catalogNum(local4?.originalPrice);
  if (pkgPrice > 0) return Math.max(100, Math.round(pkgPrice / 4));

  return 100;
}

export function getCatalogHourlyFare(driver, slabs) {
  const perHourRate = resolveCatalogHourlyRate(driver, slabs);

  return {
    perHourRate,
    fareNote: "per hour · chauffeur"
  };
}

/** Driver cards — same idea as cabs. */
export function getDriverDisplayTitle(driver = {}, trip, { includeRoute = true } = {}) {
  const name = cleanRawTitle(driver.name) || driver.serviceTitle?.trim() || "Acting driver";
  if (!trip || !includeRoute) return name;
  if (trip.from && trip.to) return `${name} · ${trip.from} → ${trip.to}`;
  const city = trip.from || trip.city || driver.city || "";
  return city ? `${name} · ${city}` : name;
}

export function getDriverCatalogSubtitle(driver = {}, city = "") {
  const vehicle = driver.vehicleType || driver.type || "Your car";
  const vendor = driver.vendor?.trim() || "Cabzii Partner";
  return city ? `${vehicle} · ${vendor} · ${city}` : `${vehicle} · ${vendor}`;
}

export function getDriverDisplaySubtitle(driver = {}, trip) {
  const vehicle = driver.vehicleType || driver.type || "Your car";
  const vendor = driver.vendor?.trim() || "Cabzii Partner";
  const city = trip?.city || trip?.from || driver.city || "";
  return city ? `${vehicle} · ${vendor} · ${city}` : `${vehicle} · ${vendor}`;
}
