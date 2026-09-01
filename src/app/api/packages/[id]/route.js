import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/packages/${params.id}`);
}

export async function PUT(req, { params }) {
  const payload = await req.json();
  return proxySeoMutation(req, `/packages/${params.id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    kind: "package",
    extra: { id: params.id, bodyRecord: payload }
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/packages/${params.id}`, {
    kind: "package",
    extra: { id: params.id },
    lookupPath: `/packages/${params.id}`
  });
}
