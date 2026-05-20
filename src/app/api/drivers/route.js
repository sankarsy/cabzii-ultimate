const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(req) {
  const authHeader = req.headers.get("authorization") || "";
  const qs = req.nextUrl.searchParams.toString();
  const url = qs ? `${BACKEND_URL}/api/v1/drivers?${qs}` : `${BACKEND_URL}/api/v1/drivers`;
  const response = await fetch(url, {
    headers: authHeader ? { authorization: authHeader } : {}
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(req) {
  const payload = await req.json();
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/drivers`, {
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
