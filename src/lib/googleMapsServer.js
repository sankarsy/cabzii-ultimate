const GOOGLE_MAPS_BASE = "https://maps.googleapis.com/maps/api";

export function getGoogleMapsApiKey() {
  return process.env.GOOGLE_MAPS_API_KEY || "";
}

function pickComponent(components, type) {
  const item = (components || []).find((c) => (c.types || []).includes(type));
  return item?.long_name || item?.short_name || "";
}

export function parseAddressComponents(components) {
  return {
    city:
      pickComponent(components, "locality") ||
      pickComponent(components, "administrative_area_level_2") ||
      pickComponent(components, "administrative_area_level_3"),
    state: pickComponent(components, "administrative_area_level_1"),
    pincode: pickComponent(components, "postal_code"),
    country: pickComponent(components, "country")
  };
}

export async function geocodeAddress(address, apiKey) {
  const endpoint = `${GOOGLE_MAPS_BASE}/geocode/json?address=${encodeURIComponent(address)}&components=country:in&key=${apiKey}`;
  const res = await fetch(endpoint, { cache: "no-store" });
  const data = await res.json();
  const result = data?.results?.[0];
  if (!result) return null;
  const parts = parseAddressComponents(result.address_components);
  const loc = result.geometry?.location || {};
  return {
    label: result.formatted_address,
    placeId: result.place_id,
    lat: loc.lat,
    lng: loc.lng,
    ...parts
  };
}

export async function reverseGeocode(lat, lng, apiKey) {
  const endpoint = `${GOOGLE_MAPS_BASE}/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const res = await fetch(endpoint, { cache: "no-store" });
  const data = await res.json();
  const result = data?.results?.[0];
  if (!result) return null;
  const parts = parseAddressComponents(result.address_components);
  const loc = result.geometry?.location || {};
  return {
    label: result.formatted_address,
    placeId: result.place_id,
    lat: loc.lat ?? lat,
    lng: loc.lng ?? lng,
    ...parts
  };
}

export async function placeDetails(placeId, apiKey) {
  const endpoint = `${GOOGLE_MAPS_BASE}/place/details/json?place_id=${encodeURIComponent(
    placeId
  )}&fields=formatted_address,geometry,address_components,place_id&key=${apiKey}`;
  const res = await fetch(endpoint, { cache: "no-store" });
  const data = await res.json();
  const result = data?.result;
  if (!result) return null;
  const parts = parseAddressComponents(result.address_components);
  const loc = result.geometry?.location || {};
  return {
    label: result.formatted_address,
    placeId: result.place_id || placeId,
    lat: loc.lat,
    lng: loc.lng,
    ...parts
  };
}
