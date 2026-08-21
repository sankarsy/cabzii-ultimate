import { proxyRequest } from "../../../../../lib/backendProxy";

export async function POST(req, { params }) {
  return proxyRequest(req, `/buses/${params.id}/duplicate`, { method: "POST" });
}
