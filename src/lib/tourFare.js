import { num, packageYouPay } from "./cabFare";

export const MIN_TOUR_PERSONS = 1;
export const MAX_TOUR_PERSONS = 30;

export function clampTourPersons(value) {
  const n = Math.floor(num(value, 1));
  return Math.min(MAX_TOUR_PERSONS, Math.max(MIN_TOUR_PERSONS, n));
}

/** price in DB is per person */
export function calculateTourTotals(pricePerPerson, persons, discountPct) {
  const perPersonList = num(pricePerPerson);
  const count = clampTourPersons(persons);
  const d = Math.min(99, Math.max(0, num(discountPct)));
  const perPersonPay = packageYouPay(perPersonList, d);
  const listTotal = perPersonList * count;
  const total = perPersonPay * count;
  const discountAmount = Math.max(0, listTotal - total);

  return {
    persons: count,
    perPersonList,
    perPersonPay,
    listTotal,
    total,
    discountPct: d,
    discountAmount
  };
}

export function tourSelectionFromTotals(pkg, totals, { pickup = "", date = "" } = {}) {
  const duration = pkg?.duration || pkg?.name || "Tour package";
  return {
    packageLabel: duration,
    serviceTab: "tour",
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
    note:
      totals.persons > 1
        ? `${totals.persons} travellers × ₹${totals.perPersonPay.toLocaleString("en-IN")} per person`
        : `₹${totals.perPersonPay.toLocaleString("en-IN")} per person`
  };
}

export function buildTourPaymentParams(pkgId, { totals, pickup, date }) {
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
  return q;
}
