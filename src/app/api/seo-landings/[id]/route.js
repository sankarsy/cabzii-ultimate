import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/seo-landings/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/seo-landings/${params.id}`, {
    method: "PUT",
    body,
    kind: "seo-landing"
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/seo-landings/${params.id}`, {
    kind: "seo-landing",
    lookupPath: `/seo-landings/${params.id}`
  });
}
