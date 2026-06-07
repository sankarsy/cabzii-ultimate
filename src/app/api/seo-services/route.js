import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/seo-services");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/seo-services", { method: "POST", body });
}
