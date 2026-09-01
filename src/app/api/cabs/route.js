import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/cabs");
}

export async function POST(req) {
  const payload = await req.json();
  return proxySeoMutation(req, "/cabs", {
    method: "POST",
    body: JSON.stringify(payload),
    kind: "cab",
    extra: { bodyRecord: payload }
  });
}
