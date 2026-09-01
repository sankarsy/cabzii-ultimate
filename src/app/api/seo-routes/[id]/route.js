import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/seo-routes/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/seo-routes/${params.id}`, {
    method: "PUT",
    body,
    kind: "seo-route"
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/seo-routes/${params.id}`, {
    kind: "seo-route",
    lookupPath: `/seo-routes/${params.id}`
  });
}
