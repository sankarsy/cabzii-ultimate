import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/buses");
}

export async function POST(req) {
  const payload = await req.json();
  return proxyRequest(req, "/buses", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
