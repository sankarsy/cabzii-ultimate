import { hasRouteEndpoints } from "./tripCoords";

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

  if (![...params.keys()].length) {
    throw new Error("Select pickup and drop places first.");
  }

  const res = await fetch(`/api/distance?${params}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (res.ok && json?.distanceKm) {
    return json;
  }
  throw new Error(json?.error || "Driving distance unavailable");
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
