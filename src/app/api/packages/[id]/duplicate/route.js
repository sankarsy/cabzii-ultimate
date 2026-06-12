import { proxyRequest } from "../../../../../lib/backendProxy";

export async function POST(req, { params }) {
  return proxyRequest(req, `/packages/${params.id}/duplicate`, { method: "POST" });
}
