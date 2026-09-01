import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/seo-city-pages/${params.id}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/seo-city-pages/${params.id}`, {
    method: "PUT",
    body,
    kind: "seo-city-page"
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/seo-city-pages/${params.id}`, {
    kind: "seo-city-page",
    lookupPath: `/seo-city-pages/${params.id}`
  });
}
