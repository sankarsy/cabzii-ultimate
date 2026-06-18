const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000"
)
  .trim()
  .replace(/\/+$/, "");

/** Fetch published CMS page by slug (server-side). Returns null if not found. */
export async function fetchCmsPageBySlug(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/enterprise/cms-pages/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 120 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.published !== false ? json.data : null;
  } catch {
    return null;
  }
}
