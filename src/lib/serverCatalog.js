import { getBackendUrl } from "./seo";

async function fetchJson(path, revalidate = 300) {
  const backend = getBackendUrl();
  try {
    const res = await fetch(`${backend}/api/v1${path}`, {
      next: { revalidate }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchCabById(id) {
  if (!id) return null;
  return fetchJson(`/cabs/${encodeURIComponent(id)}`);
}

export async function fetchDriverById(id) {
  if (!id) return null;
  return fetchJson(`/drivers/${encodeURIComponent(id)}`);
}

export async function fetchPackageById(id) {
  if (!id) return null;
  return fetchJson(`/packages/${encodeURIComponent(id)}`);
}

export async function fetchCatalogList(resource, limit = 6) {
  const data = await fetchJson(`/${resource}?limit=${limit}&page=1`, 600);
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/blogs/${encodeURIComponent(slug)}`, 600);
}

export async function fetchSeoServiceBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/seo-services/${encodeURIComponent(slug)}`, 600);
}

export async function fetchSeoRouteBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/seo-routes/${encodeURIComponent(slug)}`, 600);
}

export async function fetchSeoMenuLinks() {
  const data = await fetchJson("/seo-menu", 300);
  return Array.isArray(data) ? data : [];
}
