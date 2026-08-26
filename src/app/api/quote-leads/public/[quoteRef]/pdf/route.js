import { backendUrl } from "../../../../../../lib/backendProxy";

export async function GET(_req, { params }) {
  const quoteRef = params.quoteRef;
  const response = await fetch(backendUrl(`/quote-leads/public/${quoteRef}/pdf`), { cache: "no-store" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: "Quote PDF not found" }));
    return Response.json({ success: false, message: data.message || "Quote PDF not found" }, { status: response.status });
  }
  const buf = await response.arrayBuffer();
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cabzii-quote-${quoteRef}.pdf"`,
      "Cache-Control": "private, max-age=60"
    }
  });
}
