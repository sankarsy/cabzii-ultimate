import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/packages");
}

export async function POST(req) {
  const payload = await req.json();
  return proxyRequest(req, "/packages", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
