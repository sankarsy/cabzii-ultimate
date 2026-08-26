import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/quote-leads");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/quote-leads", { method: "POST", body });
}
