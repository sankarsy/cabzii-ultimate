import { backendUrl, proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/cities/${params.id}`, { url: backendUrl(`/cities/${params.id}`) });
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/cities/${params.id}`, {
    method: "PUT",
    url: backendUrl(`/cities/${params.id}`),
    body
  });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/cities/${params.id}`, {
    method: "DELETE",
    url: backendUrl(`/cities/${params.id}`)
  });
}
