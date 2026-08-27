import { proxyRequest } from "../../../../../lib/backendProxy";

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/seo-events/insights/${params.id}`, { method: "PUT", body });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/seo-events/insights/${params.id}`, { method: "DELETE" });
}
