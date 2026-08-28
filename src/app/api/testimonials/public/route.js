import { proxyRequest } from "../../../../lib/backendProxy";

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/testimonials/public", { method: "POST", body });
}
