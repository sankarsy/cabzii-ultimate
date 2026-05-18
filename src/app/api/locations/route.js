import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/locations");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/locations", { method: "POST", body });
}
