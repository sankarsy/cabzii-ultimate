import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/seo-services");
}

export async function POST(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/seo-services", { method: "POST", body, kind: "seo-service" });
}
