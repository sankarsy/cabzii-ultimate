import { getGoogleMapsApiKey, placeDetails as googlePlaceDetails } from "../../../../lib/googleMapsServer";
import { lookupPlace } from "../../../../lib/nominatimServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = (searchParams.get("placeId") || "").trim();
  const label = (searchParams.get("label") || "").trim();

  if (!placeId && !label) {
    return Response.json({ error: "placeId or label is required" }, { status: 400 });
  }

  try {
    if (placeId.startsWith("osm:") || placeId.startsWith("nominatim:")) {
      const data = await lookupPlace(placeId);
      if (data) return Response.json({ success: true, data });
    }

    const apiKey = getGoogleMapsApiKey();
    if (placeId && apiKey) {
      const data = await googlePlaceDetails(placeId, apiKey);
      if (data) return Response.json({ success: true, data });
    }

    if (label) {
      const { geocodeAddress } = await import("../../../../lib/nominatimServer");
      const data = await geocodeAddress(label);
      if (data) return Response.json({ success: true, data });
    }

    return Response.json({ error: "Place not found" }, { status: 404 });
  } catch {
    return Response.json({ error: "Place details request failed" }, { status: 500 });
  }
}
