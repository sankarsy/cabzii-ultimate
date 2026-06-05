import { estimateDurationMin, estimateRoadDistanceKm } from "./openRouteService";
import { hasRouteEndpoints } from "./tripCoords";

export function estimateDistanceForTrip(trip) {
  if (!hasRouteEndpoints(trip)) return null;
  const distanceKm = estimateRoadDistanceKm(
    trip.fromLat,
    trip.fromLng,
    trip.toLat,
    trip.toLng
  );
  return {
    fromLat: trip.fromLat,
    fromLng: trip.fromLng,
    toLat: trip.toLat,
    toLng: trip.toLng,
    distanceKm,
    durationMin: estimateDurationMin(distanceKm),
    estimated: true
  };
}

export async function fetchTripDistance(trip) {
  const params = new URLSearchParams();
  if (hasRouteEndpoints(trip)) {
    params.set("fromLat", String(trip.fromLat));
    params.set("fromLng", String(trip.fromLng));
    params.set("toLat", String(trip.toLat));
    params.set("toLng", String(trip.toLng));
  } else {
    if (trip?.from) params.set("from", trip.from);
    if (trip?.to) params.set("to", trip.to);
  }

  try {
    const res = await fetch(`/api/distance?${params}`, { cache: "no-store" });
    const json = await res.json();
    if (res.ok && json?.distanceKm) {
      return json;
    }
  } catch {
    /* fall through to estimate */
  }

  const estimate = estimateDistanceForTrip(trip);
  if (estimate) return estimate;
  throw new Error("Distance unavailable");
}

export function applyDistanceToTrip(trip, distanceData) {
  if (!distanceData) return trip;
  return {
    ...trip,
    fromLat: distanceData.fromLat ?? trip.fromLat,
    fromLng: distanceData.fromLng ?? trip.fromLng,
    toLat: distanceData.toLat ?? trip.toLat,
    toLng: distanceData.toLng ?? trip.toLng,
    distanceKm: distanceData.distanceKm,
    durationMin: distanceData.durationMin
  };
}
