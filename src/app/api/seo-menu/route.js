import { getBackendUrl } from "../../../lib/seo";

export async function GET() {
  try {
    const res = await fetch(`${getBackendUrl()}/api/v1/seo-menu`, { next: { revalidate: 300 } });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ success: false, data: [] }, { status: 503 });
  }
}
