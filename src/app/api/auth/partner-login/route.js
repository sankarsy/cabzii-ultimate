import { proxyRequest } from "../../../../lib/backendProxy";

export async function POST(req) {
  const payload = await req.json();
  return proxyRequest(req, "/auth/partner-login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
