const DEFAULT_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = process.env.NOMINATIM_USER_AGENT || "CabziiCabBooking/1.0 (contact@cabzii.in)";

function baseUrl() {
  return (process.env.NOMINATIM_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");
}

async function nominatimFetch(path, params = {}) {
  const url = new URL(`${baseUrl()}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  let res;
  try {
    res = await fetch(url.toString(), {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" }
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) return null;
  return res.json();
}

function osmTypeChar(osmType) {
  const t = String(osmType || "").toLowerCase();
  if (t === "node") return "N";
  if (t === "way") return "W";
  if (t === "relation") return "R";
  return "N";
}

export function osmPlaceId(osmType, osmId) {
  return `osm:${osmTypeChar(osmType)}:${osmId}`;
}

export function parseOsmPlaceId(placeId) {
  const raw = String(placeId || "");
  if (!raw.startsWith("osm:")) return null;
  const parts = raw.split(":");
  if (parts.length < 3) return null;
  const typeChar = parts[1].toUpperCase();
  const id = parts[2];
  const map = { N: "node", W: "way", R: "relation" };
  return { osmType: map[typeChar] || "node", osmId: id, osmIds: `${typeChar}${id}` };
}

function cityFromAddress(addr = {}) {
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.county ||
    addr.state_district ||
    ""
  );
}

export function mapNominatimResult(item) {
  if (!item) return null;
  const addr = item.address || {};
  const lat = Number(item.lat);
  const lng = Number(item.lon ?? item.lng);
  return {
    label: item.display_name || item.name || "",
    placeId: item.place_id ? `nominatim:${item.place_id}` : osmPlaceId(item.osm_type, item.osm_id),
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    city: cityFromAddress(addr),
    state: addr.state || "",
    pincode: addr.postcode || "",
    country: addr.country || "India",
    source: "nominatim"
  };
}

export async function searchPlaces(query, { limit = 8, countrycodes = "in" } = {}) {
  const q = String(query || "").trim();
  if (q.length < 2) return [];
  const data = await nominatimFetch("/search", {
    q,
    format: "json",
    addressdetails: 1,
    countrycodes,
    limit
  });
  if (!Array.isArray(data)) return [];
  return data.map(mapNominatimResult).filter((x) => x?.label);
}

export async function geocodeAddress(query) {
  const list = await searchPlaces(query, { limit: 1 });
  return list[0] || null;
}

export async function reverseGeocode(lat, lng) {
  const data = await nominatimFetch("/reverse", {
    lat,
    lon: lng,
    format: "json",
    addressdetails: 1
  });
  return mapNominatimResult(data);
}

export async function lookupPlace(placeId) {
  const osm = parseOsmPlaceId(placeId);
  if (osm) {
    const data = await nominatimFetch("/lookup", {
      osm_ids: osm.osmIds,
      format: "json",
      addressdetails: 1
    });
    const item = Array.isArray(data) ? data[0] : null;
    return mapNominatimResult(item);
  }

  if (String(placeId).startsWith("nominatim:")) {
    const pid = placeId.split(":")[1];
    const data = await nominatimFetch("/details", {
      place_id: pid,
      format: "json",
      addressdetails: 1
    });
    return mapNominatimResult(data);
  }

  return null;
}
