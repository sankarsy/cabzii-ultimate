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

/** City-prioritized cabs/drivers for SEO service & route landings. */
export async function fetchCatalogForCity(resource, cityName, limit = 8) {
  if (!cityName) return fetchCatalogList(resource, limit);
  const q = new URLSearchParams({
    limit: String(limit),
    page: "1",
    priorityCity: cityName,
    city: cityName
  });
  const data = await fetchJson(`/${resource}?${q.toString()}`, 600);
  const list = Array.isArray(data) ? data : [];
  if (list.length >= Math.min(4, limit)) return list;
  // Fallback: city-agnostic featured list so landings never look empty
  const fallback = await fetchCatalogList(resource, limit);
  return fallback;
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

/** Admin-managed meta for /cab-booking/{city} and /acting-driver/{city}. */
export async function fetchSeoCityPage(pageType, citySlug) {
  if (!pageType || !citySlug) return null;
  return fetchJson(`/seo-city-pages/${encodeURIComponent(pageType)}/${encodeURIComponent(citySlug)}`, 600);
}

export async function fetchSeoMenuLinks() {
  const data = await fetchJson("/seo-menu", 300);
  return Array.isArray(data) ? data : [];
}
