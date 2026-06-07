import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/seo-services/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/seo-services/${params.id}`, { method: "PUT", body });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/seo-services/${params.id}`, { method: "DELETE" });
}
