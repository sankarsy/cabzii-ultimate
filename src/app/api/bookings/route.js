import { proxyRequest } from "../../../lib/backendProxy";

export async function GET(req) {
  return proxyRequest(req, "/bookings");
}

export async function POST(req) {
  const body = await req.text();
  return proxyRequest(req, "/bookings", { method: "POST", body });
}
