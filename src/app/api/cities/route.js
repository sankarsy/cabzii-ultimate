import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/cities");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/cities", { method: "POST", body });
}
