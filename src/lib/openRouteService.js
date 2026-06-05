const ORS_BASE = "https://api.openrouteservice.org";
const ROUTE_TIMEOUT_MS = 4000;

function getApiKey() {
  return process.env.OPENROUTESERVICE_API_KEY || "";
}

async function fetchWithTimeout(url, options = {}, timeoutMs = ROUTE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Driving route between two lat/lng points.
 * @returns {{ distanceKm, durationMin, geometry: [lat,lng][] } | null}
 */
async function getOsrmRoute(fromLat, fromLng, toLat, toLng) {
  const lat1 = Number(fromLat);
  const lng1 = Number(fromLng);
  const lat2 = Number(toLat);
  const lng2 = Number(toLng);
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
    const res = await fetchWithTimeout(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    const distanceKm = Math.max(1, Math.round((route.distance || 0) / 1000));
    const durationMin = Math.max(1, Math.round((route.duration || 0) / 60));
    const geometry = (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]);
    return { distanceKm, durationMin, geometry, estimated: false };
  } catch {
    return null;
  }
}

export async function getDrivingRoute(fromLat, fromLng, toLat, toLng) {
  const lat1 = Number(fromLat);
  const lng1 = Number(fromLng);
  const lat2 = Number(toLat);
  const lng2 = Number(toLng);
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return null;

  const osrm = await getOsrmRoute(lat1, lng1, lat2, lng2);
  if (osrm) return osrm;

  const key = getApiKey();
  if (!key) return null;

  try {
    const res = await fetchWithTimeout(`${ORS_BASE}/v2/directions/driving-car/geojson`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: key,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        coordinates: [
          [lng1, lat1],
          [lng2, lat2]
        ]
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const feature = data?.features?.[0];
    const props = feature?.properties?.summary;
    const coords = feature?.geometry?.coordinates;
    if (!props || !coords?.length) return null;

    const distanceKm = Math.max(1, Math.round((props.distance || 0) / 1000));
    const durationMin = Math.max(1, Math.round((props.duration || 0) / 60));
    const geometry = coords.map(([lng, lat]) => [lat, lng]);

    return { distanceKm, durationMin, geometry };
  } catch {
    return null;
  }
}

/** Haversine fallback when ORS key is missing */
export function estimateRoadDistanceKm(fromLat, fromLng, toLat, toLng) {
  const R = 6371;
  const dLat = ((toLat - fromLat) * Math.PI) / 180;
  const dLng = ((toLng - fromLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const straight = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1, Math.round(straight * 1.25));
}

export function estimateDurationMin(distanceKm) {
  const avgKmh = 45;
  return Math.max(15, Math.round((distanceKm / avgKmh) * 60));
}
