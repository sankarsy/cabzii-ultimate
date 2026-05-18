const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

async function fetchDbCities(input) {
  const predictions = [];
  try {
    const citiesRes = await fetch(`${BACKEND_URL}/api/v1/cities?active=1`, { cache: "no-store" });
    const citiesData = await citiesRes.json();
    const q = input.toLowerCase();
    (citiesData?.data ?? []).forEach((city) => {
      const label = city.state ? `${city.name}, ${city.state}, India` : `${city.name}, India`;
      if (label.toLowerCase().includes(q)) {
        predictions.push({ label, source: "database", placeId: null });
      }
    });
  } catch {
    /* ignore */
  }
  return predictions;
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
      predictions.push({ label, source: "database", placeId: null });
    });
  } catch {
    /* ignore */
  }
  return predictions;
}

function mergeUnique(items, limit = 8) {
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
    return Response.json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (types === "cities") {
    const db = await fetchDbCities(input);
    const google = await fetchGoogleCities(input, apiKey);
    const predictions = mergeUnique([...db, ...google], 10);
    return Response.json({ predictions });
  }

  const dbLocs = await fetchDbLocations(input);
  const dbCities = await fetchDbCities(input);
  let predictions = mergeUnique([...dbLocs, ...dbCities], 8);

  if (apiKey && predictions.length < 8) {
    const google = await fetchGooglePlaces(input, apiKey);
    predictions = mergeUnique([...predictions, ...google], 8);
  }

  return Response.json({
    predictions: predictions.map((p) => p.label)
  });
}
