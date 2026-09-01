import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/cabs/${params.id}`);
}

export async function PUT(req, { params }) {
  const payload = await req.json();
  return proxySeoMutation(req, `/cabs/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    kind: "cab",
    extra: { id: params.id, bodyRecord: payload }
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/cabs/${params.id}`, {
    kind: "cab",
    extra: { id: params.id },
    lookupPath: `/cabs/${params.id}`
  });
}
