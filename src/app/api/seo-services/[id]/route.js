import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/seo-services/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/seo-services/${params.id}`, {
    method: "PUT",
    body,
    kind: "seo-service"
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/seo-services/${params.id}`, {
    kind: "seo-service",
    lookupPath: `/seo-services/${params.id}`
  });
}
