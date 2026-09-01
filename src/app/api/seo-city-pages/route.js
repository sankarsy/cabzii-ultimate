import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/seo-city-pages");
}

export async function POST(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/seo-city-pages", { method: "POST", body, kind: "seo-city-page" });
}
