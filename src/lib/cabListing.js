import { getCabVehicleName } from "./catalogDisplay";
import { estimateDurationMin } from "./openRouteService";

const TYPE_ORDER = ["Hatchback", "Sedan", "SUV", "Van"];

export function cabTypeBucket(cab = {}) {
  const blob = `${cab.type || ""} ${cab.category || ""} ${cab.title || ""} ${cab.vehicleModel || ""}`.toLowerCase();
  if (/tempo|traveller|van|bus|urbania|coach/.test(blob)) return "Van";
  if (/innova|crysta|ertiga|xylo|xuv|fortuner|hycross|suv|mpv/.test(blob)) return "SUV";
  if (/hatch|wagon|alto|i10|i20|celerio|tiago/.test(blob) && !/dzire/.test(blob)) return "Hatchback";
  if (/sedan|dzire|etios|amaze|xcent|verna|ciaz/.test(blob)) return "Sedan";
  const type = String(cab.type || "").trim();
  if (/suv|mpv/i.test(type)) return "SUV";
  if (/hatch/i.test(type)) return "Hatchback";
  if (/sedan/i.test(type)) return "Sedan";
  if (/van|tempo/i.test(type)) return "Van";
  return type || "Cab";
}

export function cabFuelLabel(cab = {}) {
  const raw = String(cab.fuelType || cab.fuel || "").trim();
  if (!raw) return "";
  if (/cng/i.test(raw) && /diesel/i.test(raw)) return "CNG/Diesel";
  if (/cng/i.test(raw) && /petrol/i.test(raw)) return "CNG/Petrol";
  if (/^cng$/i.test(raw)) return "CNG";
  return raw.replace(/\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function cabFuelBadgeClass(label) {
  const t = String(label || "");
  if (/diesel/i.test(t) && !/cng/i.test(t)) return "bg-amber-600";
  if (/petrol/i.test(t) && !/cng/i.test(t)) return "bg-sky-700";
  return "bg-emerald-600";
}

export function countBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

export function cabTypeOptions(cabs) {
  const counts = countBy(cabs, cabTypeBucket);
  const keys = Array.from(counts.keys());
  keys.sort((a, b) => {
    const ia = TYPE_ORDER.indexOf(a);
    const ib = TYPE_ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b);
  });
  return keys.map((label) => ({ label, count: counts.get(label) }));
}

export function cabModelOptions(cabs) {
  const counts = countBy(cabs, getCabVehicleName);
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

export function cabFuelOptions(cabs) {
  const counts = countBy(cabs, cabFuelLabel);
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

function formatApproxHours(min) {
  const n = Number(min);
  if (!Number.isFinite(n) || n <= 0) return "";
  const hours = Math.round((n / 60) * 10) / 10;
  if (hours < 1) return `${Math.round(n)} min approx time`;
  return `${hours} hr(s) approx time`;
}

export function formatRatesLine(trip) {
  const km = Number(trip?.distanceKm);
  const kmPart = Number.isFinite(km) && km > 0 ? `Rates for ${Math.round(km)} Kms approx distance` : "";
  let duration = Number(trip?.durationMin);
  if ((!Number.isFinite(duration) || duration <= 0) && Number.isFinite(km) && km > 0) {
    duration = estimateDurationMin(km);
  }
  const timePart = formatApproxHours(duration);
  if (kmPart && timePart) return `${kmPart} | ${timePart}`;
  return kmPart || timePart;
}
