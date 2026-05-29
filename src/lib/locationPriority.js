import { normalizeCityName } from "./tamilNaduCities";

export const SELECTED_CITY_STORAGE_KEY = "cabzii-selected-location";
export const SERVICE_AREA_STORAGE_KEY = "cabzii-service-area";

export function readServiceArea() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SERVICE_AREA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeServiceArea(area) {
  if (typeof window === "undefined" || !area) return;
  localStorage.setItem(SERVICE_AREA_STORAGE_KEY, JSON.stringify(area));
  if (area.city) writeSelectedCity(area.city);
  window.dispatchEvent(new CustomEvent("cabzii-service-area-change", { detail: area }));
}

export function catalogPriorityParams(city) {
  const p = new URLSearchParams();
  if (city) p.set("priorityCity", city);
  return p.toString() ? `&${p.toString()}` : "";
}

export function extractCityFromLabel(label) {
  return normalizeCityName(label);
}

export function readSelectedCity() {
  if (typeof window === "undefined") return "Chennai";
  return localStorage.getItem(SELECTED_CITY_STORAGE_KEY) || "Chennai";
}

export function writeSelectedCity(city) {
  if (typeof window === "undefined") return;
  const name = extractCityFromLabel(city) || "Chennai";
  localStorage.setItem(SELECTED_CITY_STORAGE_KEY, name);
  window.dispatchEvent(new CustomEvent("cabzii-city-change", { detail: { city: name } }));
}

export function matchesSelectedCity(item, selectedCity) {
  const city = normalizeCityName(selectedCity);
  if (!city) return false;
  const hay = [
    item?.city,
    item?.location,
    item?.vendor,
    item?.title,
    item?.name,
    Array.isArray(item?.tags) ? item.tags.join(" ") : ""
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(city.toLowerCase());
}

export function sortBySelectedCity(items, selectedCity) {
  const city = normalizeCityName(selectedCity);
  if (!city) return [...items];
  return [...items].sort((a, b) => {
    const am = matchesSelectedCity(a, city) ? 1 : 0;
    const bm = matchesSelectedCity(b, city) ? 1 : 0;
    if (bm !== am) return bm - am;
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });
}
