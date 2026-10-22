const PLACES_BASE = "https://places.googleapis.com/v1";
const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const FETCH_MS = 12000;

export function getGoogleMapsApiKey() {
  return String(process.env.GOOGLE_MAPS_API_KEY || "").trim();
}

export function googleMapsConfigured() {
  return Boolean(getGoogleMapsApiKey());
}

class GoogleMapsError extends Error {
  constructor(message, { status = 502, code = "" } = {}) {
    super(message);
    this.name = "GoogleMapsError";
    this.status = status;
    this.code = code;
  }
}

export { GoogleMapsError };

async function googleFetch(url, { method = "GET", headers = {}, body } = {}) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new GoogleMapsError("GOOGLE_MAPS_API_KEY is not set on the server.", { status: 503, code: "MISSING_KEY" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    const res = await fetch(url, {
      method,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = data?.error || {};
      const status = Number(err.code || res.status) || 502;
      const message =
        err.message ||
        (status === 429 ? "Google Maps quota exceeded. Try again shortly." : "Google Maps request failed.");
      throw new GoogleMapsError(message, { status: status === 403 || status === 401 ? 503 : status, code: err.status || "" });
    }
    return data;
  } catch (err) {
    if (err instanceof GoogleMapsError) throw err;
    if (err?.name === "AbortError") {
      throw new GoogleMapsError("Google Maps request timed out.", { status: 504, code: "TIMEOUT" });
    }
    throw new GoogleMapsError("Could not reach Google Maps.", { status: 502, code: "NETWORK" });
  } finally {
    clearTimeout(timer);
  }
}

function pickComponent(components, type) {
  const item = (components || []).find((c) => (c.types || []).includes(type));
  return item?.longText || item?.shortText || item?.long_name || item?.short_name || "";
}

export function parseAddressComponents(components) {
  return {
    city:
      pickComponent(components, "locality") ||
      pickComponent(components, "postal_town") ||
      pickComponent(components, "administrative_area_level_3") ||
      pickComponent(components, "administrative_area_level_2"),
    state: pickComponent(components, "administrative_area_level_1"),
    pincode: pickComponent(components, "postal_code"),
    country: pickComponent(components, "country")
  };
}

function placeIdResource(placeId) {
  const id = String(placeId || "").replace(/^places\//, "");
  return id;
}

/**
 * Places API (New) Autocomplete.
 * @param {{ input: string, sessionToken?: string, lat?: number, lng?: number, citiesOnly?: boolean }} opts
 */
export async function autocompletePlaces({ input, sessionToken, lat, lng, citiesOnly = false }) {
  const body = {
    input: String(input || "").trim(),
    languageCode: "en",
    includedRegionCodes: ["in"]
  };
  if (sessionToken) body.sessionToken = sessionToken;
  if (citiesOnly) {
    body.includedPrimaryTypes = ["locality", "administrative_area_level_2"];
  }
  const latN = Number(lat);
  const lngN = Number(lng);
  if (Number.isFinite(latN) && Number.isFinite(lngN)) {
    body.locationBias = {
      circle: {
        center: { latitude: latN, longitude: lngN },
        radius: 50000.0
      }
    };
  }

  const data = await googleFetch(`${PLACES_BASE}/places:autocomplete`, {
    method: "POST",
    headers: {
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types"
    },
    body
  });

  return (data?.suggestions || [])
    .map((row) => {
      const pred = row?.placePrediction;
      if (!pred?.placeId) return null;
      const main = pred.structuredFormat?.mainText?.text || "";
      const secondary = pred.structuredFormat?.secondaryText?.text || "";
      const label = pred.text?.text || [main, secondary].filter(Boolean).join(", ");
      return {
        label,
        mainText: main || label,
        secondaryText: secondary,
        placeId: pred.placeId,
        types: pred.types || [],
        source: "google"
      };
    })
    .filter(Boolean);
}

/** Places API (New) Place Details. */
export async function placeDetails(placeId, sessionToken) {
  const id = placeIdResource(placeId);
  if (!id) return null;
  const qs = sessionToken ? `?sessionToken=${encodeURIComponent(sessionToken)}` : "";
  const data = await googleFetch(`${PLACES_BASE}/places/${encodeURIComponent(id)}${qs}`, {
    headers: {
      "X-Goog-FieldMask": "id,formattedAddress,displayName,location,addressComponents,googleMapsUri"
    }
  });
  if (!data?.location) return null;
  const parts = parseAddressComponents(data.addressComponents);
  return {
    label: data.formattedAddress || data.displayName?.text || "",
    placeId: data.id || id,
    lat: data.location.latitude,
    lng: data.location.longitude,
    mapsUri: data.googleMapsUri || "",
    ...parts
  };
}

async function geocodeJson(params) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new GoogleMapsError("GOOGLE_MAPS_API_KEY is not set on the server.", { status: 503, code: "MISSING_KEY" });
  }
  const url = `${GEOCODE_URL}?${params}&key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    const data = await res.json().catch(() => ({}));
    if (data.status === "OVER_QUERY_LIMIT" || data.status === "RESOURCE_EXHAUSTED") {
      throw new GoogleMapsError("Google Maps quota exceeded. Try again shortly.", { status: 429, code: data.status });
    }
    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new GoogleMapsError(data.error_message || "Geocoding failed.", { status: 502, code: data.status });
    }
    return data?.results?.[0] || null;
  } catch (err) {
    if (err instanceof GoogleMapsError) throw err;
    if (err?.name === "AbortError") {
      throw new GoogleMapsError("Geocoding timed out.", { status: 504, code: "TIMEOUT" });
    }
    throw new GoogleMapsError("Could not geocode that location.", { status: 502, code: "NETWORK" });
  } finally {
    clearTimeout(timer);
  }
}

function fromGeocodeResult(result, fallbackLat, fallbackLng) {
  if (!result) return null;
  const parts = parseAddressComponents(result.address_components);
  const loc = result.geometry?.location || {};
  return {
    label: result.formatted_address,
    placeId: result.place_id,
    lat: loc.lat ?? fallbackLat,
    lng: loc.lng ?? fallbackLng,
    ...parts
  };
}

export async function geocodeAddress(address) {
  const query = String(address || "").trim();
  if (!query) return null;
  const result = await geocodeJson(`address=${encodeURIComponent(query)}&components=country:IN&region=in`);
  return fromGeocodeResult(result);
}

export async function reverseGeocode(lat, lng) {
  const latN = Number(lat);
  const lngN = Number(lng);
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) return null;
  const result = await geocodeJson(`latlng=${latN},${lngN}&result_type=street_address|premise|sublocality|locality`);
  return fromGeocodeResult(result, latN, lngN) || fromGeocodeResult(await geocodeJson(`latlng=${latN},${lngN}`), latN, lngN);
}

function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const str = String(encoded || "");
  while (index < str.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  if (points.length <= 180) return points;
  const step = Math.ceil(points.length / 180);
  return points.filter((_, i) => i === 0 || i === points.length - 1 || i % step === 0);
}

function parseDurationSeconds(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const match = String(value || "").match(/^([\d.]+)s$/);
  return match ? Number(match[1]) : 0;
}

/** Routes API — road distance and duration. */
export async function computeDrivingRoute(fromLat, fromLng, toLat, toLng) {
  const lat1 = Number(fromLat);
  const lng1 = Number(fromLng);
  const lat2 = Number(toLat);
  const lng2 = Number(toLng);
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) {
    throw new GoogleMapsError("Pickup and drop coordinates are required.", { status: 400, code: "MISSING_COORDS" });
  }

  const data = await googleFetch(ROUTES_URL, {
    method: "POST",
    headers: {
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline"
    },
    body: {
      origin: { location: { latLng: { latitude: lat1, longitude: lng1 } } },
      destination: { location: { latLng: { latitude: lat2, longitude: lng2 } } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
      languageCode: "en-IN",
      units: "METRIC",
      regionCode: "IN"
    }
  });

  const route = data?.routes?.[0];
  if (!route?.distanceMeters) {
    throw new GoogleMapsError("No driving route between these locations.", { status: 404, code: "NO_ROUTE" });
  }

  const distanceKm = Math.round((Number(route.distanceMeters) / 1000) * 10) / 10;
  const durationMin = Math.max(1, Math.round(parseDurationSeconds(route.duration) / 60));
  const geometry = decodePolyline(route.polyline?.encodedPolyline);

  return {
    distanceKm,
    durationMin,
    geometry,
    estimated: false
  };
}
