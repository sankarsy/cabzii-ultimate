import { backendUrl, proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/locations/${params.id}`, { url: backendUrl(`/locations/${params.id}`) });
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/locations/${params.id}`, {
    method: "PUT",
    url: backendUrl(`/locations/${params.id}`),
    body
  });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/locations/${params.id}`, {
    method: "DELETE",
    url: backendUrl(`/locations/${params.id}`)
  });
}
