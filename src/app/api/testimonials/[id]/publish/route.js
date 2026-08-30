import { proxyRequest } from "../../../../../lib/backendProxy";

export async function PATCH(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/testimonials/${params.id}/publish`, { method: "PATCH", body });
}
