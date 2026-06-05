import { coordsForPlaceLabel } from "../../../lib/indiaCityCoords";
import { geocodeAddress } from "../../../lib/nominatimServer";
import {
  estimateDurationMin,
  estimateRoadDistanceKm,
  getDrivingRoute
} from "../../../lib/openRouteService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();
  let fromLat = searchParams.get("fromLat");
  let fromLng = searchParams.get("fromLng");
  let toLat = searchParams.get("toLat");
  let toLng = searchParams.get("toLng");

  try {
    if (!fromLat || !fromLng) {
      if (!from) {
        return Response.json({ error: "from or fromLat/fromLng required" }, { status: 400 });
      }
      const local = coordsForPlaceLabel(from);
      const geo = local || (await geocodeAddress(from));
      if (!geo?.lat || !geo?.lng) {
        return Response.json({ error: "Could not geocode pickup" }, { status: 400 });
      }
      fromLat = geo.lat;
      fromLng = geo.lng;
    }

    if (!toLat || !toLng) {
      if (!to) {
        return Response.json({ error: "to or toLat/toLng required" }, { status: 400 });
      }
      const local = coordsForPlaceLabel(to);
      const geo = local || (await geocodeAddress(to));
      if (!geo?.lat || !geo?.lng) {
        return Response.json({ error: "Could not geocode drop" }, { status: 400 });
      }
      toLat = geo.lat;
      toLng = geo.lng;
    }

    const lat1 = Number(fromLat);
    const lng1 = Number(fromLng);
    const lat2 = Number(toLat);
    const lng2 = Number(toLng);

    let route = await getDrivingRoute(lat1, lng1, lat2, lng2);
    if (!route) {
      const distanceKm = estimateRoadDistanceKm(lat1, lng1, lat2, lng2);
      route = {
        distanceKm,
        durationMin: estimateDurationMin(distanceKm),
        geometry: [
          [lat1, lng1],
          [lat2, lng2]
        ],
        estimated: true
      };
    }

    return Response.json({
      success: true,
      fromLat: lat1,
      fromLng: lng1,
      toLat: lat2,
      toLng: lng2,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      geometry: route.geometry,
      estimated: Boolean(route.estimated)
    });
  } catch {
    return Response.json({ error: "Distance calculation failed" }, { status: 500 });
  }
}
