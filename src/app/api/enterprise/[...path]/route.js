import { proxyRequest } from "../../../../lib/backendProxy";

function enterprisePath(segments) {
  return `/enterprise/${(segments || []).join("/")}`;
}

export async function GET(req, { params }) {
  return proxyRequest(req, enterprisePath(params.path));
}

export async function POST(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, enterprisePath(params.path), { method: "POST", body });
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxyRequest(req, enterprisePath(params.path), { method: "PUT", body });
}

export async function DELETE(req, { params }) {
  return proxyRequest(req, enterprisePath(params.path), { method: "DELETE" });
}
