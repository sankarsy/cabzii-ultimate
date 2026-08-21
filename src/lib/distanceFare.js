import { num } from "./cabFare";

/** Use distance × per-km when route distance is known (outstation / point-to-point). */
export function shouldUseDistanceFare(trip) {
  const km = num(trip?.distanceKm);
  if (km <= 0) return false;
  if (trip?.tripType === "outstation") return true;
  if (trip?.from?.trim() && trip?.to?.trim()) return true;
  return false;
}

/** Per-km rate from package slab or catalog base price. */
export function resolvePerKmRate(slab, catalogItem = {}) {
  const fromSlab = num(slab?.extraKm);
  if (fromSlab > 0) return fromSlab;

  const pkgKey = slab?.id === "outstation_twoway" ? "outstationRoundTrip" : "outstationOneWay";
  const pkgRate = num(catalogItem?.farePackages?.[pkgKey]?.extraKmRate);
  if (pkgRate > 0) return pkgRate;

  const base = num(catalogItem?.price);
  if (base > 0 && base <= 30) return base;

  return Math.max(12, Math.floor(num(catalogItem?.price) / 100) || 14);
}

/**
 * @param {{ distanceKm: number, perKmRate: number, roundTrip?: boolean, driverBatta?: number, minFare?: number, discountPct?: number }} opts
 */
export function calculateDistanceFare({
  distanceKm,
  perKmRate,
  roundTrip = false,
  driverBatta = 0,
  minFare = 0
}) {
  const km = Math.max(1, Math.ceil(num(distanceKm)));
  const rate = Math.max(1, num(perKmRate));
  const multiplier = roundTrip ? 2 : 1;
  const distanceCharge = Math.round(km * rate * multiplier);
  const listPrice = Math.max(num(minFare), distanceCharge + num(driverBatta));

  return {
    distanceKm: km,
    perKmRate: rate,
    distanceCharge,
    driverBatta: num(driverBatta),
    listPrice,
    total: listPrice,
    discountPct: 0,
    discountAmount: 0,
    fareNote: `${km} km × ₹${rate}/km${roundTrip ? " (round trip)" : ""}${driverBatta > 0 ? ` + ₹${driverBatta} driver bata` : ""}`,
    usesDistance: true
  };
}

/** Cab fare for search results / booking — package or distance-based. */
export function resolveCabTripFare(cab, slab, trip) {
  const packageTotal = num(slab?.price) > 0 ? num(slab.price) : num(slab?.originalPrice) || num(slab?.list) || num(cab?.price);

  if (!shouldUseDistanceFare(trip)) {
    return {
      listPrice: packageTotal,
      total: packageTotal,
      discountPct: 0,
      discountAmount: 0,
      perKmRate: resolvePerKmRate(slab, cab),
      usesDistance: false,
      fareNote: slab?.label ? `Package: ${slab.label}` : "Package fare"
    };
  }

  const perKm = resolvePerKmRate(slab, cab);
  const includedKm = num(slab?.includedKm);
  const billedKm = Boolean(trip.roundTrip) ? num(trip.distanceKm) * 2 : num(trip.distanceKm);
  const extraKmCharge = includedKm > 0 ? Math.max(0, billedKm - includedKm) * perKm : 0;
  const driverBatta = trip.tripType === "outstation" ? num(cab?.driverAllowance) : 0;
  const minFare = includedKm > 0 ? packageTotal + extraKmCharge : packageTotal;

  return calculateDistanceFare({
    distanceKm: trip.distanceKm,
    perKmRate: perKm,
    roundTrip: Boolean(trip.roundTrip),
    driverBatta,
    minFare,
    discountPct: 0
  });
}

export function resolveDriverTripFare(driver, slab, trip) {
  const packageTotal =
    num(slab?.price) > 0 ? num(slab.price) : num(slab?.originalPrice) || num(slab?.list) || num(driver?.pricing?.day);

  if (!shouldUseDistanceFare(trip)) {
    return {
      listPrice: packageTotal,
      total: packageTotal,
      discountPct: 0,
      discountAmount: 0,
      perKmRate: resolvePerKmRate(slab, driver),
      usesDistance: false,
      fareNote: slab?.label ? `Package: ${slab.label}` : "Package fare"
    };
  }

  const perKm = resolvePerKmRate(slab, driver);
  return calculateDistanceFare({
    distanceKm: trip.distanceKm,
    perKmRate: perKm,
    roundTrip: Boolean(trip.roundTrip),
    minFare: packageTotal > 0 ? Math.min(packageTotal, perKm * Math.ceil(num(trip.distanceKm))) : 0,
    discountPct: 0
  });
}
