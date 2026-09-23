import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/seo-landings");
}

export async function POST(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/seo-landings", { method: "POST", body, kind: "seo-landing" });
}
