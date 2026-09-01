import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/packages");
}

export async function POST(req) {
  const payload = await req.json();
  return proxySeoMutation(req, "/packages", {
    method: "POST",
    body: JSON.stringify(payload),
    kind: "package",
    extra: { bodyRecord: payload }
  });
}
