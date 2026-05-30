import { getBackendUrl } from "./seo";

async function fetchJson(path, revalidate = 300) {
  const backend = getBackendUrl();
  const url = `${backend}/api/v1${path}`;
  try {
    const res = await fetch(url, {
      next: { revalidate }
    });
    if (!res.ok) {
      console.error(`[serverCatalog] ${res.status} ${res.statusText} from ${url}`);
      return null;
    }
    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error(`[serverCatalog] fetch failed for ${url}: ${error?.cause?.code || error?.message}`);
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
