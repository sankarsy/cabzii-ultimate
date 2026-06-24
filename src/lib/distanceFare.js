import { num, packageYouPay } from "./cabFare";

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
  if (base > 0 && base <= 200) return base;

  return Math.max(12, Math.floor(base / 10) || 12);
}

/**
 * @param {{ distanceKm: number, perKmRate: number, roundTrip?: boolean, driverBatta?: number, minFare?: number, discountPct?: number }} opts
 */
export function calculateDistanceFare({
  distanceKm,
  perKmRate,
  roundTrip = false,
  driverBatta = 0,
  minFare = 0,
  discountPct = 0
}) {
  const km = Math.max(1, Math.ceil(num(distanceKm)));
  const rate = Math.max(1, num(perKmRate));
  const multiplier = roundTrip ? 2 : 1;
  const distanceCharge = Math.round(km * rate * multiplier);
  const listPrice = Math.max(num(minFare), distanceCharge + num(driverBatta));
  const discount = Math.min(99, Math.max(0, num(discountPct)));
  const total = discount > 0 ? packageYouPay(listPrice, discount) : listPrice;

  return {
    distanceKm: km,
    perKmRate: rate,
    distanceCharge,
    driverBatta: num(driverBatta),
    listPrice,
    total,
    discountPct: discount,
    discountAmount: Math.max(0, listPrice - total),
    fareNote: `${km} km × ₹${rate}/km${roundTrip ? " (round trip)" : ""}${driverBatta > 0 ? ` + ₹${driverBatta} driver bata` : ""}`,
    usesDistance: true
  };
}

/** Cab fare for search results / booking — package or distance-based. */
export function resolveCabTripFare(cab, slab, trip) {
  const listPrice = num(slab?.originalPrice) || num(slab?.list) || num(cab?.price);
  const discount = num(slab?.discountPercentage) || num(cab?.discountPercentage);
  const packageTotal = num(slab?.price) > 0 ? num(slab.price) : packageYouPay(listPrice, discount);

  if (!shouldUseDistanceFare(trip)) {
    return {
      listPrice,
      total: packageTotal,
      discountPct: discount,
      discountAmount: Math.max(0, listPrice - packageTotal),
      perKmRate: resolvePerKmRate(slab, cab),
      usesDistance: false,
      fareNote: slab?.label ? `Package: ${slab.label}` : "Package fare"
    };
  }

  const perKm = resolvePerKmRate(slab, cab);
  const driverBatta =
    trip.tripType === "outstation" && packageTotal > perKm * trip.distanceKm
      ? Math.max(0, Math.round(packageTotal - perKm * trip.distanceKm))
      : 0;

  return calculateDistanceFare({
    distanceKm: trip.distanceKm,
    perKmRate: perKm,
    roundTrip: Boolean(trip.roundTrip),
    driverBatta,
    minFare: Math.min(packageTotal, perKm * Math.ceil(num(trip.distanceKm))),
    discountPct: discount
  });
}

/** Driver fare for search results / booking — package or distance-based. */
export function resolveDriverTripFare(driver, slab, trip) {
  const listPrice = num(slab?.originalPrice) || num(slab?.list) || num(driver?.pricing?.day);
  const discount = num(slab?.discountPercentage) || num(driver?.discountPercentage);
  const packageTotal =
    num(slab?.price) > 0 ? num(slab.price) : listPrice > 0 ? packageYouPay(listPrice, discount) : 0;

  if (!shouldUseDistanceFare(trip)) {
    return {
      listPrice,
      total: packageTotal,
      discountPct: discount,
      discountAmount: Math.max(0, listPrice - packageTotal),
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
    discountPct: discount
  });
}
