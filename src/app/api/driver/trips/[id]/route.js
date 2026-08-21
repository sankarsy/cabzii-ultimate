import { proxyRequest } from "../../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/driver/trips/${params.id}`);
}
