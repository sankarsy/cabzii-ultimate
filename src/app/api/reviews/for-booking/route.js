import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/reviews/for-booking");
}
