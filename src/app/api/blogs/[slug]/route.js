import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/blogs/${params.slug}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/blogs/${params.slug}`, { method: "PUT", body });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/blogs/${params.slug}`, { method: "DELETE" });
}
