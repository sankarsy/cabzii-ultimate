import { proxyRequest } from "../../../../../lib/backendProxy";

export async function PATCH(req, { params }) {
  return proxyRequest(req, `/bookings/${params.id}/finish`, { method: "PATCH" });
}
