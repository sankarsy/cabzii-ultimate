import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/offers");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/offers", { method: "POST", body });
}
