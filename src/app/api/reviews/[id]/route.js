import { proxyRequest } from "../../../../lib/backendProxy";

export async function DELETE(req, { params }) {
  return proxyRequest(req, `/reviews/${params.id}`, { method: "DELETE" });
}
