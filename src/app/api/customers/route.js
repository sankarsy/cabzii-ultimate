import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/users");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/users", { method: "POST", body });
}
