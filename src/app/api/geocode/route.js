import { geocodeAddress, getGoogleMapsApiKey, reverseGeocode } from "../../../lib/googleMapsServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") || searchParams.get("q") || "").trim();
  const pincode = (searchParams.get("pincode") || "").trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return Response.json({ error: "GOOGLE_MAPS_API_KEY is not configured" }, { status: 503 });
  }

  try {
    if (lat && lng) {
      const data = await reverseGeocode(Number(lat), Number(lng), apiKey);
      if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
      return Response.json({ success: true, data });
    }

    const query = pincode ? `${pincode}, India` : address;
    if (!query) {
      return Response.json({ error: "address, pincode, or lat/lng required" }, { status: 400 });
    }

    const data = await geocodeAddress(query, apiKey);
    if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
    return Response.json({ success: true, data });
  } catch {
    return Response.json({ error: "Geocode request failed" }, { status: 500 });
  }
}
