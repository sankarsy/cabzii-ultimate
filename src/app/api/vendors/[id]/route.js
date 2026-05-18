import { backendUrl, proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/vendors/${params.id}`, {
    url: backendUrl(`/vendors/${params.id}`)
  });
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/vendors/${params.id}`, {
    method: "PUT",
    url: backendUrl(`/vendors/${params.id}`),
    body
  });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/vendors/${params.id}`, {
    method: "DELETE",
    url: backendUrl(`/vendors/${params.id}`)
  });
}
