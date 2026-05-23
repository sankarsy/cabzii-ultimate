import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/drivers");
}

export async function POST(req) {
  const payload = await req.json();
  return proxyRequest(req, "/drivers", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
