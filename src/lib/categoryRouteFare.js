import { cabTypeBucket } from "./cabListing";

export const CATEGORY_FARE_LABELS = ["Hatchback", "Sedan", "SUV", "Van"];

export function categoryFareMap(row) {
  if (!row) return null;
  const map = {
    Hatchback: Number(row.hatchback ?? row.hatchbackFrom) || 0,
    Sedan: Number(row.sedan ?? row.sedanFrom) || 0,
    SUV: Number(row.suv ?? row.suvFrom) || 0,
    Van: Number(row.van ?? row.vanFrom) || 0
  };
  if (!CATEGORY_FARE_LABELS.some((key) => map[key] > 0)) return null;
  return map;
}

export function shouldApplyCategoryRouteFare(trip) {
  const from = String(trip?.from || "").trim();
  const to = String(trip?.to || "").trim();
  if (!from || !to || from.toLowerCase() === to.toLowerCase()) return false;
  const kind = String(trip?.tripType || "").toLowerCase();
  if (kind === "local" || kind === "hourly" || kind === "airport") return false;
  return true;
}

export function fareForCabCategory(cab, fareMap) {
  if (!fareMap) return 0;
  return Number(fareMap[cabTypeBucket(cab)]) || 0;
}
