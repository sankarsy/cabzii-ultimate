import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/vendors");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/vendors", { method: "POST", body });
}
