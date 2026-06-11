import { calculateBookingTotals, num, packageYouPay, vendorInitials } from "./cabFare";
import { buildStandardChargeItems } from "./productCharges";

export { num, vendorInitials as driverInitials };

export function isOutstationDriver(driver) {
  const t = String(driver?.type ?? "").toLowerCase();
  return t.includes("outstation");
}

/** Same package structure as cabs (cabFare SLAB_META). Keys support legacy driver DB fields. */
const DRIVER_SLAB_META = [
  { id: "local_4hr", group: "local", defaultLabel: "4 Hrs / 40 Km", key: "local4hr", legacyKey: "local4hr", popular: true },
  {
    id: "local_1day",
    group: "local",
    defaultLabel: "8 Hrs / 80 Km",
    key: "local8hr",
    legacyKey: "localDay",
    altKeys: ["localDay"]
  },
  {
    id: "outstation_oneway",
    group: "outstation",
    defaultLabel: "One Way",
    key: "outstationOneWay",
    legacyKey: "outstationOneWay",
    note: "Per Trip Quote"
  },
  {
    id: "outstation_twoway",
    group: "outstation",
    defaultLabel: "Two Way",
    key: "outstationRoundTrip",
    legacyKey: "outstation12hr",
    altKeys: ["outstation12hr"],
    note: "Round Trip Quote"
  }
];

function pickStoredPackage(packages, meta) {
  const primary = packages?.[meta.key];
  if (primary && (num(primary.price) > 0 || num(primary.originalPrice) > 0)) return primary;
  for (const alt of meta.altKeys || []) {
    const p = packages?.[alt];
    if (p && (num(p.price) > 0 || num(p.originalPrice) > 0)) return p;
  }
  return packages?.[meta.key] || packages?.[meta.legacyKey];
}

function resolveDriverPackageFare(pkg, driver, fallbackList) {
  const discount = num(pkg?.discountPercentage ?? driver?.discountPercentage);
  const originalPrice =
    num(pkg?.originalPrice) > 0 ? num(pkg.originalPrice) : Math.max(num(fallbackList), 0);
  const price = num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(originalPrice, discount);
  const hourly = num(driver?.pricing?.hourly);
  const day = num(driver?.pricing?.day);
  const extraHr = num(pkg?.extraHourRate) || num(driver?.pricing?.extraHour) || hourly || 0;
  const extraKm = num(pkg?.extraKmRate) > 0 ? num(pkg.extraKmRate) : Math.max(12, Math.floor((day || hourly || 100) / 10));

  return { originalPrice, price, discountPercentage: discount, extraKm, extraHr };
}

function buildLegacyDriverSlabs(driver) {
  const hourly = num(driver?.pricing?.hourly);
  const day = num(driver?.pricing?.day);
  const local4 = hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.round(day * 0.55) : 0;
  const local8 = day > 0 ? day : hourly > 0 ? Math.round(hourly * 8) : local4;
  const outOne = day > 0 ? day : hourly > 0 ? Math.round(hourly * 12) : Math.max(local8, local4, 0);
  const outTwo = day > 0 ? Math.round(day * 1.85) : Math.round(outOne * 1.62);
  return {
    local4hr: local4,
    localDay: local8,
    local8hr: local8,
    outstationOneWay: outOne,
    outstation12hr: outTwo,
    outstationRoundTrip: outTwo
  };
}

export function getDriverPricing(driver) {
  const slabs = buildDriverFareSlabs(driver);
  const first = slabs[0];
  const extraHr = first?.extraHr ?? num(driver?.pricing?.extraHour) ?? 0;
  const extraKm = first?.extraKm ?? 12;
  const nightCharge = extraHr > 0 ? Math.max(0, Math.round(extraHr * 0.25)) : null;
  return {
    hourly: num(driver?.pricing?.hourly),
    day: num(driver?.pricing?.day),
    extraHr,
    extraKm,
    nightCharge
  };
}

export function buildDriverFareSlabs(driver) {
  const packages = driver?.farePackages || {};
  const legacy = buildLegacyDriverSlabs(driver);

  return DRIVER_SLAB_META.map((meta) => {
    const stored = pickStoredPackage(packages, meta);
    const fallbackList = legacy[meta.legacyKey] ?? legacy[meta.key] ?? 0;
    const fare = resolveDriverPackageFare(stored, driver, fallbackList);
    const label = meta.defaultLabel;

    return {
      id: meta.id,
      group: meta.group,
      label,
      shortLabel: label,
      list: fare.originalPrice,
      originalPrice: fare.originalPrice,
      price: fare.price,
      discountPercentage: fare.discountPercentage,
      popular: meta.popular,
      note: meta.note,
      extraKm: fare.extraKm,
      extraHr: fare.extraHr
    };
  });
}

export function buildDriverChargeItems(driver) {
  const { extraKm, extraHr, nightCharge } = getDriverPricing(driver);
  return buildStandardChargeItems({
    extraKm,
    extraHr,
    nightCharge,
    serviceCharges: driver?.serviceCharges
  });
}

export function formatDriverRating(driver) {
  if (driver?.rating == null || driver?.rating === "") return null;
  const n = Number(driver.rating);
  if (!Number.isFinite(n) || n <= 0) return null;
  /* Ratings come only from verified reviews — hide entirely until the first approved review */
  const reviews = Number(driver.reviewCount ?? driver.reviews ?? 0);
  if (!Number.isFinite(reviews) || reviews <= 0) return null;
  return n.toFixed(1);
}

export function buildDriverPaymentSearchParams(driverId, selection) {
  if (!driverId || !selection) return null;
  const q = new URLSearchParams({
    type: "driver",
    id: String(driverId),
    baseFare: String(selection.baseFare ?? selection.fare ?? 0),
    taxes: String(selection.taxes ?? 0),
    total: String(selection.total ?? 0),
    listPrice: String(selection.listPrice ?? selection.baseFare ?? 0),
    discountPct: String(selection.discountPct ?? 0),
    discountAmount: String(selection.discountAmount ?? 0)
  });
  if (selection.packageId) q.set("packageId", selection.packageId);
  if (selection.packageLabel) q.set("package", selection.packageLabel);
  if (selection.serviceTab) q.set("service", selection.serviceTab);
  return q;
}

export function selectionFromDriverPackage(pkg, tab, discountPct) {
  const listPrice = num(pkg?.originalPrice) > 0 ? num(pkg.originalPrice) : num(pkg?.list ?? 0);
  const d =
    pkg?.discountPercentage != null && pkg?.discountPercentage !== ""
      ? num(pkg.discountPercentage)
      : num(discountPct);
  const baseFromPkg = num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(listPrice, d);
  const totals = calculateBookingTotals(listPrice, d);
  const total = listPrice > 0 && num(pkg?.price) > 0 ? baseFromPkg : totals.total;

  return {
    packageId: pkg?.id,
    packageLabel: pkg?.label,
    serviceTab: tab,
    listPrice,
    extraKm: pkg?.extraKm,
    extraHr: pkg?.extraHr,
    note: pkg?.note,
    ...totals,
    baseFare: total,
    total,
    fare: total
  };
}
