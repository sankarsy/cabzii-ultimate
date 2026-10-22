import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/route-fares");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/route-fares", { method: "POST", body });
}
