import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/blogs");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/blogs", { method: "POST", body });
}
