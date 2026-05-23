import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/cabs");
}

export async function POST(req) {
  const payload = await req.json();
  return proxyRequest(req, "/cabs", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
