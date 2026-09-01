import { authorizeRevalidateRequest } from "../../../../lib/revalidation/authorize";
import { isSafeSeoPath } from "../../../../lib/revalidation/paths";
import { revalidateSeoPages } from "../../../../lib/revalidation/revalidateSeoPage";

export async function POST(req) {
  const auth = await authorizeRevalidateRequest(req);
  if (!auth.ok) {
    return Response.json({ success: false, message: auth.message }, { status: auth.status });
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  const requested = Array.isArray(body.paths) ? body.paths : body.path ? [body.path] : [];
  const paths = requested.filter(isSafeSeoPath).slice(0, 20);

  if (!paths.length) {
    return Response.json({ success: false, message: "Provide a safe public SEO path" }, { status: 400 });
  }

  const revalidated = revalidateSeoPages(paths);
  return Response.json({ success: true, revalidated, via: auth.via });
}
