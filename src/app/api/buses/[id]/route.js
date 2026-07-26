import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/buses/${params.id}`);
}

export async function PUT(req, { params }) {
  const payload = await req.json();
  return proxyRequest(req, `/buses/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/buses/${params.id}`, { method: "DELETE" });
}
