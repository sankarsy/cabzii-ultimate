import { buildStandardChargeItems } from "./productCharges";

export function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function packageYouPay(list, discount) {
  const d = Math.min(99, Math.max(0, num(discount)));
  return d > 0 ? Math.round(list * (1 - d / 100)) : list;
}

function resolvePackageFare(pkg, cab, fallbackList) {
  const cabDiscount = num(cab.discountPercentage);
  const originalPrice =
    num(pkg?.originalPrice) > 0
      ? num(pkg.originalPrice)
      : num(pkg?.list) > 0
        ? num(pkg.list)
        : Math.max(num(fallbackList), 0);
  const discountPercentage =
    pkg?.discountPercentage != null && pkg?.discountPercentage !== ""
      ? num(pkg.discountPercentage)
      : cabDiscount;
  const price =
    num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(originalPrice, discountPercentage);
  const extraKm =
    num(pkg?.extraKmRate) > 0
      ? num(pkg.extraKmRate)
      : Math.max(12, Math.floor(num(cab.price) / 10) || 12);
  const extraHr =
    num(pkg?.extraHourRate) > 0
      ? num(pkg.extraHourRate)
      : num(cab.extraHourRate) || Math.max(12, Math.floor(num(cab.price) / 12) || 12);

  return { originalPrice, price, discountPercentage, extraKm, extraHr };
}

function buildLegacySlabs(cab) {
  const hourly = num(cab.hourlyRate);
  const day = num(cab.dayRate);
  const price = num(cab.price);
  const local4 =
    hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.round(day * 0.55) : price > 0 ? Math.round(price * 0.4) : 0;
  const local8 = day > 0 ? day : hourly > 0 ? Math.round(hourly * 8) : price > 0 ? Math.round(price * 0.72) : 0;
  const outOne = price > 0 ? Math.round(price) : Math.max(local8, local4, 0);
  const outTwo = day > 0 ? Math.round(day * 1.85) : Math.round(outOne * 1.62);
  return { local4, local8, outOne, outTwo };
}

const SLAB_META = [
  { id: "local_4hr", group: "local", defaultLabel: "4 Hrs / 40 Km", key: "local4hr", legacy: "local4", popular: true },
  { id: "local_1day", group: "local", defaultLabel: "8 Hrs / 80 Km", key: "local8hr", legacy: "local8" },
  {
    id: "outstation_oneway",
    group: "outstation",
    defaultLabel: "One Way",
    key: "outstationOneWay",
    legacy: "outOne",
    note: "Per Trip Quote"
  },
  {
    id: "outstation_twoway",
    group: "outstation",
    defaultLabel: "Two Way",
    key: "outstationRoundTrip",
    legacy: "outTwo",
    note: "Round Trip Quote"
  }
];

export function buildFareSlabs(cab) {
  const packages = cab?.farePackages || {};
  const legacy = buildLegacySlabs(cab);

  return SLAB_META.map((meta) => {
    const stored = packages[meta.key];
    const fallbackList = legacy[meta.legacy];
    const fare = resolvePackageFare(stored, cab, fallbackList);
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

export function formatRating(cab) {
  if (cab.rating == null || cab.rating === "") return null;
  const n = Number(cab.rating);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

export function vendorInitials(vendor) {
  const parts = String(vendor || "V")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) || "V").toUpperCase();
}

/** Full payment breakdown for a selected package (GST not shown or added to payable total) */
export function calculateBookingTotals(listPrice, discountPct) {
  const list = Math.max(0, num(listPrice));
  const d = Math.min(99, Math.max(0, num(discountPct)));
  const baseFare = packageYouPay(list, d);
  const discountAmount = list - baseFare;
  const taxes = 0;
  const total = baseFare;
  return { listPrice: list, discountPct: d, discountAmount, baseFare, taxes, total, taxRate: 0 };
}

export function buildPaymentSearchParams(cabId, selection) {
  if (!cabId || !selection) return null;
  const q = new URLSearchParams({
    type: "cab",
    id: String(cabId),
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

export function selectionFromPackage(pkg, tab, fallbackDiscountPct) {
  const discountPct =
    pkg?.discountPercentage != null && pkg?.discountPercentage !== ""
      ? num(pkg.discountPercentage)
      : num(fallbackDiscountPct);
  const listPrice = num(pkg?.originalPrice) > 0 ? num(pkg.originalPrice) : num(pkg?.list ?? 0);
  const baseFromPkg = num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(listPrice, discountPct);
  const totals = calculateBookingTotals(listPrice, discountPct);
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

export function buildCabChargeItems(cab, overrides = {}) {
  const price = num(cab.price);
  const rawExtra = cab.extraHourRate;
  const extraHour =
    overrides.extraHr ??
    (rawExtra != null && rawExtra !== "" && Number.isFinite(Number(rawExtra)) ? num(rawExtra) : price);
  const extraKmRate = overrides.extraKm ?? Math.max(12, Math.floor(price / 10) || 12);
  const nightCharge =
    overrides.nightCharge ??
    (extraHour > 0 ? Math.max(0, Math.round(extraHour * 0.25)) : null);
  return buildStandardChargeItems({
    extraKm: extraKmRate,
    extraHr: extraHour,
    nightCharge,
    serviceCharges: cab?.serviceCharges
  });
}
