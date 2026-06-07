import { proxyRequest } from "../../../../lib/backendProxy";

export async function GET(req, { params }) {
  return proxyRequest(req, `/bookings/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, `/bookings/${params.id}`, { method: "PUT", body });
}
