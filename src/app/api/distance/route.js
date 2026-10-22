import { computeDrivingRoute, geocodeAddress, GoogleMapsError, googleMapsConfigured } from "../../../lib/googleMapsServer";
import { geocodeAddress as nominatimGeocode } from "../../../lib/nominatimServer";
import { getDrivingRoute } from "../../../lib/openRouteService";

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function resolvePoint(lat, lng, label) {
  if (lat != null && lng != null) return { lat, lng };
  if (!label) return null;
  if (googleMapsConfigured()) {
    try {
      const geo = await geocodeAddress(label);
      if (geo?.lat != null) return { lat: geo.lat, lng: geo.lng };
    } catch {
      /* fallback */
    }
  }
  const geo = await nominatimGeocode(label);
  if (geo?.lat != null) return { lat: geo.lat, lng: geo.lng };
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = (searchParams.get("from") || "").trim();
  const to = (searchParams.get("to") || "").trim();
  const fromPoint = await resolvePoint(num(searchParams.get("fromLat")), num(searchParams.get("fromLng")), from);
  const toPoint = await resolvePoint(num(searchParams.get("toLat")), num(searchParams.get("toLng")), to);

  if (!fromPoint) {
    return Response.json({ error: "Select a pickup place first." }, { status: 400 });
  }
  if (!toPoint) {
    return Response.json({ error: "Select a drop place first." }, { status: 400 });
  }

  try {
    if (googleMapsConfigured()) {
      try {
        const route = await computeDrivingRoute(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng);
        return Response.json({
          success: true,
          fromLat: fromPoint.lat,
          fromLng: fromPoint.lng,
          toLat: toPoint.lat,
          toLng: toPoint.lng,
          distanceKm: route.distanceKm,
          durationMin: route.durationMin,
          geometry: route.geometry,
          estimated: false
        });
      } catch (err) {
        if (err instanceof GoogleMapsError && err.status === 429) {
          return Response.json({ error: "Distance lookup is busy. Try again shortly." }, { status: 429 });
        }
      }
    }

    const route = await getDrivingRoute(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng);
    if (!route) {
      return Response.json({ error: "No driving route between these locations." }, { status: 404 });
    }

    return Response.json({
      success: true,
      fromLat: fromPoint.lat,
      fromLng: fromPoint.lng,
      toLat: toPoint.lat,
      toLng: toPoint.lng,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      geometry: route.geometry,
      estimated: Boolean(route.estimated)
    });
  } catch {
    return Response.json({ error: "Distance calculation failed" }, { status: 500 });
  }
}
