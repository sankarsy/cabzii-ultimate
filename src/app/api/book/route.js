export async function POST(req) {
  const payload = await req.json();
  const authHeader = req.headers.get("authorization") || "";
  const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const response = await fetch(`${BACKEND_URL}/api/v1/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { authorization: authHeader } : {})
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}