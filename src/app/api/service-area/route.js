import { geocodeAddress, getGoogleMapsApiKey } from "../../../lib/googleMapsServer";

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function fetchServiceLocations({ city, pincode }) {
  const params = new URLSearchParams({ active: "1" });
  if (pincode) params.set("pincode", pincode);
  else if (city) params.set("city", city);
  const res = await fetch(`${BACKEND_URL}/api/v1/locations?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pincode = (searchParams.get("pincode") || "").trim();
  const city = (searchParams.get("city") || "").trim();
  const address = (searchParams.get("address") || "").trim();
  const apiKey = getGoogleMapsApiKey();

  let resolved = { city, pincode, label: address, lat: null, lng: null };

  if (apiKey && (pincode || address)) {
    try {
      const geo = await geocodeAddress(pincode ? `${pincode}, India` : address, apiKey);
      if (geo) {
        resolved = {
          city: geo.city || city,
          pincode: geo.pincode || pincode,
          label: geo.label,
          lat: geo.lat,
          lng: geo.lng,
          state: geo.state
        };
      }
    } catch {
      /* use provided values */
    }
  }

  const locations = await fetchServiceLocations({
    city: resolved.city,
    pincode: resolved.pincode
  });

  const inService =
    locations.length > 0 ||
    Boolean(resolved.pincode && resolved.city) ||
    Boolean(resolved.city);

  return Response.json({
    success: true,
    inService,
    serviceArea: resolved,
    locations: locations.slice(0, 20),
    message: inService
      ? `We serve ${resolved.pincode ? `PIN ${resolved.pincode}` : resolved.city || "this area"}.`
      : "Service may be limited in this pincode — contact support to confirm availability."
  });
}
