/** Duration helper for already-known road kilometres (fare logic is separate). */
export function estimateDurationMin(distanceKm) {
  const km = Number(distanceKm);
  if (!Number.isFinite(km) || km <= 0) return 0;
  const avgKmh = 45;
  return Math.max(15, Math.round((km / avgKmh) * 60));
}

/** Free OSRM driving route used only when Google Routes is not configured. */
export async function getDrivingRoute(fromLat, fromLng, toLat, toLng) {
  const lat1 = Number(fromLat);
  const lng1 = Number(fromLng);
  const lat2 = Number(toLat);
  const lng2 = Number(toLng);
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=simplified&geometries=geojson`;
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    return {
      distanceKm: Math.round(((route.distance || 0) / 1000) * 10) / 10,
      durationMin: Math.max(1, Math.round((route.duration || 0) / 60)),
      geometry: (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng]),
      estimated: false
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
