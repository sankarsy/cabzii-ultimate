import { proxyRequest } from "../../../lib/backendProxy";
import { proxySeoMutation } from "../../../lib/revalidation/proxySeoMutation";

export async function GET(req) {
  return proxyRequest(req, "/site-settings");
}

export async function PUT(req) {
  const body = await req.text();
  return proxySeoMutation(req, "/site-settings", { method: "PUT", body, kind: "site-settings" });
}
