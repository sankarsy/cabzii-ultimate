import { autocompletePlaces, GoogleMapsError, googleMapsConfigured } from "../../../lib/googleMapsServer";
import { searchPlaces as nominatimSearch } from "../../../lib/nominatimServer";

function asPrediction(item) {
  return {
    label: item.label,
    mainText: item.mainText || item.label?.split(",")[0] || item.label,
    secondaryText: item.secondaryText || item.label?.split(",").slice(1).join(",").trim() || "",
    placeId: item.placeId || null,
    lat: item.lat,
    lng: item.lng,
    city: item.city,
    source: item.source || "nominatim"
  };
}

async function nominatimPredictions(input, citiesOnly) {
  const hits = await nominatimSearch(input, { limit: 8, citiesOnly });
  return hits.map(asPrediction);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = (searchParams.get("input") || "").trim();
  const types = searchParams.get("types") || "address";
  const sessionToken = (searchParams.get("sessionToken") || "").trim();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const citiesOnly = types === "cities";

  if (input.length < 2) {
    return Response.json({ predictions: [] });
  }

  if (googleMapsConfigured()) {
    try {
      const predictions = await autocompletePlaces({
        input,
        sessionToken,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        citiesOnly
      });
      if (predictions.length) return Response.json({ predictions });
    } catch (err) {
      if (err instanceof GoogleMapsError && err.status === 429) {
        return Response.json({ predictions: [], error: "Search is busy. Try again in a moment." }, { status: 429 });
      }
    }
  }

  try {
    const predictions = await nominatimPredictions(input, citiesOnly);
    return Response.json({ predictions });
  } catch {
    return Response.json({ predictions: [], error: "Could not search places. Try again." }, { status: 502 });
  }
}
