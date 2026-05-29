import { getGoogleMapsApiKey, placeDetails } from "../../../../lib/googleMapsServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = (searchParams.get("placeId") || "").trim();
  const apiKey = getGoogleMapsApiKey();

  if (!placeId) {
    return Response.json({ error: "placeId is required" }, { status: 400 });
  }
  if (!apiKey) {
    return Response.json({ error: "GOOGLE_MAPS_API_KEY is not configured" }, { status: 503 });
  }

  try {
    const data = await placeDetails(placeId, apiKey);
    if (!data) return Response.json({ error: "Place not found" }, { status: 404 });
    return Response.json({ success: true, data });
  } catch {
    return Response.json({ error: "Place details request failed" }, { status: 500 });
  }
}
