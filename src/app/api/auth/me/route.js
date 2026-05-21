const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(req) {
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
    headers: authHeader ? { authorization: authHeader } : {}
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
