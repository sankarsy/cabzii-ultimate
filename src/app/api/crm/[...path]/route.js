import { proxyRequest } from "../../../../lib/backendProxy";

function crmPath(segments) {
  return `/crm/${(segments || []).join("/")}`;
}

export async function GET(req, { params }) {
  return proxyRequest(req, crmPath(params.path));
}

export async function POST(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, crmPath(params.path), { method: "POST", body });
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, crmPath(params.path), { method: "PUT", body });
}
