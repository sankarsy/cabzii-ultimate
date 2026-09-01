import { proxyRequest } from "../../../../lib/backendProxy";
import { proxySeoDelete, proxySeoMutation } from "../../../../lib/revalidation/proxySeoMutation";

export async function GET(req, { params }) {
  return proxyRequest(req, `/blogs/${params.slug}`);
}

export async function PUT(req, { params }) {
  const body = await req.text();
  return proxySeoMutation(req, `/blogs/${params.slug}`, {
    method: "PUT",
    body,
    kind: "blog",
    extra: { slug: params.slug }
  });
}

export async function DELETE(req, { params }) {
  return proxySeoDelete(req, `/blogs/${params.slug}`, {
    kind: "blog",
    extra: { slug: params.slug }
  });
}
