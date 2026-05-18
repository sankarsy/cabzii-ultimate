const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req, { params }) {
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/drivers/${params.id}`, {
    headers: authHeader ? { authorization: authHeader } : {}
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function PUT(req, { params }) {
  const payload = await req.json();
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/drivers/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { authorization: authHeader } : {})
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function DELETE(req, { params }) {
  const authHeader = req.headers.get("authorization") || "";
  const response = await fetch(`${BACKEND_URL}/api/v1/drivers/${params.id}`, {
    method: "DELETE",
    headers: authHeader ? { authorization: authHeader } : {}
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
