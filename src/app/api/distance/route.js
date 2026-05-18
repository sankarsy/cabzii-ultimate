export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!from || !to) {
    return Response.json({ error: "from and to are required" }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json({ error: "GOOGLE_MAPS_API_KEY is missing" }, { status: 500 });
  }

  const endpoint = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(
    to
  )}&units=metric&key=${apiKey}`;

  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    const data = await response.json();

    const element = data?.rows?.[0]?.elements?.[0];
    if (data?.status !== "OK" || element?.status !== "OK") {
      return Response.json({ error: "Unable to calculate distance from Google Maps" }, { status: 400 });
    }

    const distanceMeters = element.distance?.value ?? 0;
    const distanceKm = Math.max(1, Math.round(distanceMeters / 1000));
    return Response.json({ distanceKm });
  } catch {
    return Response.json({ error: "Distance API request failed" }, { status: 500 });
  }
}
