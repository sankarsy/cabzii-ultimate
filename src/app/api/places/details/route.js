import { geocodeAddress, GoogleMapsError, googleMapsConfigured, placeDetails } from "../../../../lib/googleMapsServer";
import { geocodeAddress as nominatimGeocode, lookupPlace } from "../../../../lib/nominatimServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = (searchParams.get("placeId") || "").trim();
  const label = (searchParams.get("label") || "").trim();
  const sessionToken = (searchParams.get("sessionToken") || "").trim();

  if (!placeId && !label) {
    return Response.json({ error: "placeId or label is required" }, { status: 400 });
  }

  try {
    if (placeId.startsWith("osm:") || placeId.startsWith("nominatim:")) {
      const data = await lookupPlace(placeId);
      if (data) return Response.json({ success: true, data });
    }

    if (placeId && googleMapsConfigured() && !placeId.startsWith("osm:") && !placeId.startsWith("nominatim:")) {
      const data = await placeDetails(placeId, sessionToken);
      if (data) return Response.json({ success: true, data });
    }

    if (label) {
      const data = googleMapsConfigured() ? await geocodeAddress(label) : await nominatimGeocode(label);
      if (data) return Response.json({ success: true, data });
    }

    return Response.json({ error: "Place not found" }, { status: 404 });
  } catch (err) {
    const status = err instanceof GoogleMapsError ? err.status : 502;
    return Response.json({ error: "Could not load that place. Try another suggestion." }, { status });
  }
}
