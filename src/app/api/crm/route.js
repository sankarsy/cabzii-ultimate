import { proxyRequest } from "../../../lib/backendProxy";

/** List / create CRM leads at GET|POST /api/crm → backend /crm/ */
export async function GET(req) {
  return proxyRequest(req, "/crm/");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/crm/", { method: "POST", body });
}
