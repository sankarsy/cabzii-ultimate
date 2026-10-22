const DEFAULT_BASE = "https://nominatim.openstreetmap.org";
const FETCH_MS = 4000;

function baseUrl() {
  return String(process.env.NOMINATIM_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");
}

function userAgent() {
  return process.env.NOMINATIM_USER_AGENT || "CabziiCabBooking/1.0 (support@cabzii.com)";
}

async function nominatimFetch(path, params = {}) {
  const url = new URL(baseUrl() + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") url.searchParams.set(key, String(value));
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": userAgent(), Accept: "application/json" }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function osmPlaceId(osmType, osmId) {
  if (!osmType || osmId == null) return null;
  return `osm:${osmType}:${osmId}`;
}

function mapHit(item) {
  if (!item) return null;
  const lat = Number(item.lat);
  const lng = Number(item.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const addr = item.address || {};
  return {
    label: item.display_name,
    placeId: item.place_id ? `nominatim:${item.place_id}` : osmPlaceId(item.osm_type, item.osm_id),
    lat,
    lng,
    city: addr.city || addr.town || addr.village || addr.suburb || addr.county || "",
    state: addr.state || "",
    pincode: addr.postcode || "",
    country: addr.country || "",
    source: "nominatim"
  };
}

export async function searchPlaces(query, { limit = 8, citiesOnly = false } = {}) {
  const data = await nominatimFetch("/search", {
    q: query,
    format: "jsonv2",
    addressdetails: 1,
    limit,
    countrycodes: "in",
    ...(citiesOnly ? { featuretype: "city" } : {})
  });
  return Array.isArray(data) ? data.map(mapHit).filter(Boolean) : [];
}

export async function geocodeAddress(query) {
  const hits = await searchPlaces(query, { limit: 1 });
  return hits[0] || null;
}

export async function reverseGeocode(lat, lng) {
  const data = await nominatimFetch("/reverse", {
    lat,
    lon: lng,
    format: "jsonv2",
    addressdetails: 1,
    zoom: 18
  });
  return mapHit(data);
}

export async function lookupPlace(placeId) {
  const raw = String(placeId || "");
  if (raw.startsWith("osm:")) {
    const parts = raw.split(":");
    const osmType = parts[1];
    const osmId = parts[2];
    const data = await nominatimFetch("/lookup", {
      osm_ids: `${String(osmType || "").charAt(0).toUpperCase()}${osmId}`,
      format: "jsonv2",
      addressdetails: 1
    });
    return Array.isArray(data) ? mapHit(data[0]) : null;
  }
  if (raw.startsWith("nominatim:")) {
    const id = raw.slice("nominatim:".length);
    const data = await nominatimFetch("/details", {
      place_id: id,
      format: "json",
      addressdetails: 1
    });
    if (!data) return null;
    return mapHit({
      ...data,
      lat: data.centroid?.coordinates?.[1] ?? data.lat,
      lon: data.centroid?.coordinates?.[0] ?? data.lon,
      display_name: data.localname || data.addresstags?.display_name || data.names?.name
    });
  }
  return null;
}
