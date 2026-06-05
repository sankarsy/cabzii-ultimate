import { geocodeAddress as googleGeocode, getGoogleMapsApiKey, reverseGeocode as googleReverse } from "../../../lib/googleMapsServer";
import { geocodeAddress as nominatimGeocode, reverseGeocode as nominatimReverse } from "../../../lib/nominatimServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") || searchParams.get("q") || "").trim();
  const pincode = (searchParams.get("pincode") || "").trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const apiKey = getGoogleMapsApiKey();

  try {
    if (lat && lng) {
      let data = await nominatimReverse(Number(lat), Number(lng));
      if (!data && apiKey) {
        data = await googleReverse(Number(lat), Number(lng), apiKey);
      }
      if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
      return Response.json({ success: true, data });
    }

    const query = pincode ? `${pincode}, India` : address;
    if (!query) {
      return Response.json({ error: "address, pincode, or lat/lng required" }, { status: 400 });
    }

    let data = await nominatimGeocode(query);
    if (!data && apiKey) {
      data = await googleGeocode(query, apiKey);
    }
    if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
    return Response.json({ success: true, data });
  } catch {
    return Response.json({ error: "Geocode request failed" }, { status: 500 });
  }
}
