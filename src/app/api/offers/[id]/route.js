import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/offers/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/offers/${params.id}`, { method: "PUT", body, kind: "offer" });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/offers/${params.id}`, { kind: "offer" });
}
