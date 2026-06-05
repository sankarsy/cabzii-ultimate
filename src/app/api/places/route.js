import { enrichPredictionWithCoords } from "../../../lib/indiaCityCoords";
import { filterTamilNaduCities } from "../../../lib/tamilNaduCities";
import { searchPlaces as nominatimSearch } from "../../../lib/nominatimServer";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const NOMINATIM_BUDGET_MS = 2200;

let citiesCache = null;
let citiesCacheAt = 0;
const CITIES_CACHE_MS = 5 * 60 * 1000;

function tamilNaduPredictions(input) {
  return filterTamilNaduCities(input)
    .slice(0, 12)
    .map((label) =>
      enrichPredictionWithCoords({
        label,
        source: "tamilnadu",
        placeId: null
      })
    );
}

async function getDbCitiesList() {
  if (citiesCache && Date.now() - citiesCacheAt < CITIES_CACHE_MS) {
    return citiesCache;
  }
  try {
    const citiesRes = await fetch(`${BACKEND_URL}/api/v1/cities?active=1`, { cache: "no-store" });
    const citiesData = await citiesRes.json();
    citiesCache = citiesData?.data ?? [];
    citiesCacheAt = Date.now();
    return citiesCache;
  } catch {
    return citiesCache || [];
  }
}

async function fetchDbCities(input) {
  const predictions = [];
  const q = input.toLowerCase();
  const cities = await getDbCitiesList();
  cities.forEach((city) => {
    const label = city.state ? `${city.name}, ${city.state}, India` : `${city.name}, India`;
    if (label.toLowerCase().includes(q)) {
      predictions.push(
        enrichPredictionWithCoords({
          label,
          source: "database",
          placeId: null
        })
      );
    }
  });
  return predictions.slice(0, 8);
}

async function fetchGoogleCities(input, apiKey) {
  const predictions = [];
  if (!apiKey) return predictions;
  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=(cities)&components=country:in&key=${apiKey}`;
    const response = await fetch(endpoint, { cache: "no-store" });
    const data = await response.json();
    (data?.predictions ?? []).forEach((item) => {
      if (item.description) {
        predictions.push({
          label: item.description,
          source: "google",
          placeId: item.place_id || null
        });
      }
    });
  } catch {
    /* ignore */
  }
  return predictions;
}

async function fetchGooglePlaces(input, apiKey) {
  const predictions = [];
  if (!apiKey) return predictions;
  try {
    const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&components=country:in&key=${apiKey}`;
    const response = await fetch(endpoint, { cache: "no-store" });
    const data = await response.json();
    (data?.predictions ?? []).forEach((item) => {
      if (item.description) {
        predictions.push({ label: item.description, source: "google", placeId: item.place_id || null });
      }
    });
  } catch {
    /* ignore */
  }
  return predictions;
}

async function fetchDbLocations(input) {
  const predictions = [];
  try {
    const locRes = await fetch(
      `${BACKEND_URL}/api/v1/locations?active=1&q=${encodeURIComponent(input)}`,
      { cache: "no-store" }
    );
    const locData = await locRes.json();
    (locData?.data ?? []).slice(0, 6).forEach((loc) => {
      const label = loc.address ? `${loc.name}, ${loc.address}` : `${loc.name}, ${loc.cityName}`;
      predictions.push(
        enrichPredictionWithCoords({
          label,
          source: "database",
          placeId: null
        })
      );
    });
  } catch {
    /* ignore */
  }
  return predictions;
}

async function fetchNominatim(input) {
  try {
    const results = await Promise.race([
      nominatimSearch(input, { limit: 6 }),
      new Promise((resolve) => setTimeout(() => resolve([]), NOMINATIM_BUDGET_MS))
    ]);
    return (results || []).map((p) => ({
      label: p.label,
      placeId: p.placeId,
      source: "nominatim",
      lat: p.lat,
      lng: p.lng,
      city: p.city
    }));
  } catch {
    return [];
  }
}

function mergeUnique(items, limit = 12) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = (searchParams.get("input") || "").trim();
  const types = searchParams.get("types") || "address";

  if (input.length < 2) {
    if (types === "cities") {
      return Response.json({ predictions: tamilNaduPredictions("") });
    }
    return Response.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (types === "cities") {
    const [tn, db, google] = await Promise.all([
      Promise.resolve(tamilNaduPredictions(input)),
      fetchDbCities(input),
      fetchGoogleCities(input, apiKey)
    ]);
    return Response.json({ predictions: mergeUnique([...tn, ...db, ...google], 14) });
  }

  const [tn, dbLocs, dbCities, nominatim] = await Promise.all([
    Promise.resolve(tamilNaduPredictions(input)),
    fetchDbLocations(input),
    fetchDbCities(input),
    fetchNominatim(input)
  ]);

  let predictions = mergeUnique([...tn, ...dbLocs, ...dbCities, ...nominatim], 12);

  if (apiKey && predictions.length < 8) {
    const google = await fetchGooglePlaces(input, apiKey);
    predictions = mergeUnique([...predictions, ...google], 12);
  }

  return Response.json({ predictions });
}
