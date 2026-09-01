import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/blogs");
}

export async function POST(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/blogs", { method: "POST", body, kind: "blog" });
}
