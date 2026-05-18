const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function PATCH(req, { params }) {
  const payload = await req.json();
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/bookings/${params.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { authorization: authHeader } : {})
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
