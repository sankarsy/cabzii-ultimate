import { proxyRequest } from "../../../../../../lib/backendProxy";

export async function POST(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/driver/trips/${params.id}/location`, { method: "POST", body });
}
