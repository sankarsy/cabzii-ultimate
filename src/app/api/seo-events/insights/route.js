import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/seo-events/insights");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/seo-events/insights", { method: "POST", body });
}
