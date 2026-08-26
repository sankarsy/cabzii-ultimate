import { backendUrl } from "../../../../../lib/backendProxy";

export async function GET(_req, { params }) {
  const quoteRef = params.quoteRef;
  const response = await fetch(backendUrl(`/quote-leads/public/${quoteRef}`), { cache: "no-store" });
  const data = await response.json().catch(() => ({ success: false, message: "Quote not found" }));
  return Response.json(data, { status: response.status });
}
