import { proxyRequest } from "../../../../../../lib/backendProxy";

export async function POST(req, { params }) {
  return proxyRequest(req, `/driver/trips/${params.id}/start`, { method: "POST" });
}
