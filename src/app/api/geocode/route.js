import { geocodeAddress, GoogleMapsError, googleMapsConfigured, reverseGeocode } from "../../../lib/googleMapsServer";
import { geocodeAddress as nominatimGeocode, reverseGeocode as nominatimReverse } from "../../../lib/nominatimServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = (searchParams.get("address") || searchParams.get("q") || "").trim();
  const pincode = (searchParams.get("pincode") || "").trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  try {
    if (lat && lng) {
      let data = null;
      if (googleMapsConfigured()) {
        try {
          data = await reverseGeocode(Number(lat), Number(lng));
        } catch (err) {
          if (err instanceof GoogleMapsError && err.status === 429) {
            return Response.json({ error: "Location lookup is busy. Try again shortly." }, { status: 429 });
          }
        }
      }
      if (!data) data = await nominatimReverse(Number(lat), Number(lng));
      if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
      return Response.json({ success: true, data });
    }

    const query = pincode ? `${pincode}, India` : address;
    if (!query) {
      return Response.json({ error: "address, pincode, or lat/lng required" }, { status: 400 });
    }

    let data = null;
    if (googleMapsConfigured()) {
      try {
        data = await geocodeAddress(query);
      } catch {
        data = null;
      }
    }
    if (!data) data = await nominatimGeocode(query);
    if (!data) return Response.json({ error: "Location not found" }, { status: 404 });
    return Response.json({ success: true, data });
  } catch {
    return Response.json({ error: "Could not look up that location." }, { status: 502 });
  }
}
