import { num, packageYouPay } from "./cabFare";

export const MIN_TOUR_PERSONS = 1;
export const MAX_TOUR_PERSONS = 30;

export function clampTourPersons(value) {
  const n = Math.floor(num(value, 1));
  return Math.min(MAX_TOUR_PERSONS, Math.max(MIN_TOUR_PERSONS, n));
}

/** Flat package fare; cabMultiplier adjusts for vehicle type. persons is group size only. */
export function calculateTourTotals(packagePrice, persons, discountPct, cabMultiplier = 1) {
  const mult = num(cabMultiplier, 1) > 0 ? num(cabMultiplier, 1) : 1;
  const packageList = Math.round(num(packagePrice) * mult);
  const count = clampTourPersons(persons);
  const d = Math.min(99, Math.max(0, num(discountPct)));
  const packagePay = packageYouPay(packageList, d);
  const listTotal = packageList;
  const total = packagePay;
  const discountAmount = Math.max(0, listTotal - total);

  return {
    persons: count,
    packageList,
    packagePay,
    listTotal,
    total,
    discountPct: d,
    discountAmount,
    perPersonList: packageList,
    perPersonPay: packagePay
  };
}

export function tourSelectionFromTotals(pkg, totals, { pickup = "", date = "", cabType = "", cabLabel = "" } = {}) {
  const cabNote = cabLabel ? `${cabLabel} · ` : "";
  return {
    packageLabel: pkg?.name || "Holiday package",
    serviceTab: "tour",
    cabType,
    cabLabel,
    listPrice: totals.listTotal,
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
    note: `${cabNote}Package fare ₹${totals.total.toLocaleString("en-IN")} · toll, permit & driver bata extra`
  };
}

export function buildTourPaymentParams(pkgId, { totals, pickup, date, cabType, cabLabel }) {
  const q = new URLSearchParams({
    type: "tour",
    id: String(pkgId),
    baseFare: String(totals.total),
    taxes: "0",
    total: String(totals.total),
    listPrice: String(totals.listTotal),
    discountPct: String(totals.discountPct),
    discountAmount: String(totals.discountAmount),
    persons: String(totals.persons)
  });
  if (pickup?.trim()) q.set("pickup", pickup.trim());
  if (date?.trim()) q.set("date", date.trim());
  if (cabType) q.set("cabType", cabType);
  if (cabLabel) q.set("cabLabel", cabLabel);
  return q;
}
