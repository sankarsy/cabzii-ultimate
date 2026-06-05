export function parseCoord(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function appendTripCoords(params, trip) {
  if (trip?.fromLat != null) params.set("fromLat", String(trip.fromLat));
  if (trip?.fromLng != null) params.set("fromLng", String(trip.fromLng));
  if (trip?.toLat != null) params.set("toLat", String(trip.toLat));
  if (trip?.toLng != null) params.set("toLng", String(trip.toLng));
  if (trip?.distanceKm != null) params.set("distanceKm", String(trip.distanceKm));
  if (trip?.durationMin != null) params.set("durationMin", String(trip.durationMin));
}

export function readTripCoords(get) {
  return {
    fromLat: parseCoord(get("fromLat")),
    fromLng: parseCoord(get("fromLng")),
    toLat: parseCoord(get("toLat")),
    toLng: parseCoord(get("toLng")),
    distanceKm: parseCoord(get("distanceKm")),
    durationMin: parseCoord(get("durationMin"))
  };
}

export function hasRouteEndpoints(trip) {
  return (
    Number.isFinite(trip?.fromLat) &&
    Number.isFinite(trip?.fromLng) &&
    Number.isFinite(trip?.toLat) &&
    Number.isFinite(trip?.toLng)
  );
}

export function formatDistance(km) {
  const n = Number(km);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 100) return `${Math.round(n)} km`;
  const rounded = Math.round(n * 10) / 10;
  return `${rounded} km`;
}

export function formatDuration(min) {
  const n = Number(min);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < 60) return `${n} min`;
  const h = Math.floor(n / 60);
  const m = n % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
