const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req) {
  const payload = await req.json();
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
