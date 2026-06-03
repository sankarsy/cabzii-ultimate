/**
 * Client-side fallback when API returns legacy cab rows (before backend restart).
 * Prefer backend normalizeCabForApi; this mirrors the per-km + bata formula only.
 */

import { num, packageYouPay } from "./cabFare";

function fareFromLegacyPkg(pkg, includedKm) {
  if (!pkg || typeof pkg !== "object") return null;
  const perKm = num(pkg.offerPrice) || num(pkg.price);
  const coverage =
    includedKm !== undefined && includedKm !== null ? num(includedKm) : num(pkg.coverage) || 100;
  const bata = num(pkg.bata);
  const discount = num(pkg.discount);
  if (perKm <= 0 && bata <= 0) return null;
  const originalPrice = Math.max(Math.round(perKm * coverage + bata), bata > 0 ? Math.round(bata * 2) : 0);
  if (originalPrice <= 0) return null;
  const price = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  return { originalPrice, price, discountPercentage: discount };
}

export function isLegacyCabRecord(cab) {
  if (!cab) return false;
  const hasLegacy = Boolean(cab.package?.oneWay || cab.package?.roundTrip);
  const hasModern = num(cab.price) > 100 || num(cab.farePackages?.outstationOneWay?.price) > 100;
  return hasLegacy && !hasModern;
}

export function normalizeCabRecord(cab) {
  if (!cab || !isLegacyCabRecord(cab)) return cab;
  const oneWay = cab.package?.oneWay;
  const roundTrip = cab.package?.roundTrip;
  const local4hr = fareFromLegacyPkg(oneWay, 40);
  const local8hr = fareFromLegacyPkg(oneWay, 80);
  const outstationOneWay = fareFromLegacyPkg(oneWay, num(oneWay?.coverage) || 100);
  const outstationRoundTrip = fareFromLegacyPkg(roundTrip, num(roundTrip?.coverage) || 200);
  const price = num(outstationOneWay?.price) || num(local8hr?.price) || 0;

  return {
    ...cab,
    title: cab.title || cab.name || "Cab",
    vendor: cab.vendor || "Cabzii Partner",
    price,
    originalPrice: num(outstationOneWay?.originalPrice) || price,
    hourlyRate: local4hr ? Math.round(local4hr.price / 4) : 0,
    dayRate: local8hr?.price || 0,
    discountPercentage: num(oneWay?.discount) || num(cab.discountPercentage),
    farePackages: {
      local4hr: local4hr || outstationOneWay,
      local8hr: local8hr || outstationOneWay,
      outstationOneWay: outstationOneWay || local8hr,
      outstationRoundTrip: outstationRoundTrip || outstationOneWay
    },
    city: cab.city || (String(cab.name || "").toLowerCase().includes("chennai") ? "Chennai" : "")
  };
}

export function normalizeCabList(list) {
  return Array.isArray(list) ? list.map(normalizeCabRecord) : [];
}
