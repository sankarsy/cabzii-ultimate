import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/testimonials");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/testimonials", { method: "POST", body });
}
