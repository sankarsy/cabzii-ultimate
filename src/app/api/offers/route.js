import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/offers");
}

export async function POST(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/offers", { method: "POST", body, kind: "offer" });
}
