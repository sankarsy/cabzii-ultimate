/** Merge live route distance into trip for fare cards (results / passenger / payment). */
export function mergeTripDistance(trip, route) {
  if (!trip) return trip;
  if (Number(trip.distanceKm) > 0) return trip;
  if (!route?.distanceKm) return trip;

  return {
    ...trip,
    distanceKm: route.distanceKm,
    durationMin: route.durationMin ?? trip.durationMin,
    fromLat: route.fromLat ?? trip.fromLat,
    fromLng: route.fromLng ?? trip.fromLng,
    toLat: route.toLat ?? trip.toLat,
    toLng: route.toLng ?? trip.toLng
  };
}
