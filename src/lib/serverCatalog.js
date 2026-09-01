import { isLiveApiHostProtected } from "./liveApiHostGuard";
import { getBackendUrl } from "./seo";
import { SHOWCASE_FALLBACKS } from "./homeShowcase";
import { mergeCallDriverServices } from "./callDriver";
import { SEO_REVALIDATE_SECONDS } from "./revalidation/constants";

const FETCH_CACHE_MS = 60 * 1000;
const fetchCache = new Map();
const fetchInflight = new Map();

async function fetchJson(path, revalidate = SEO_REVALIDATE_SECONDS) {
  if (isLiveApiHostProtected()) return null;
  const cached = fetchCache.get(path);
  if (cached && Date.now() - cached.at < FETCH_CACHE_MS) return cached.value;
  if (fetchInflight.has(path)) return fetchInflight.get(path);

  const pending = (async () => {
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
  })()
    .then((value) => {
      fetchCache.set(path, { at: Date.now(), value });
      fetchInflight.delete(path);
      return value;
    })
    .catch((err) => {
      fetchInflight.delete(path);
      throw err;
    });

  fetchInflight.set(path, pending);
  return pending;
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
  const data = await fetchJson(`/${resource}?limit=${limit}&page=1`, SEO_REVALIDATE_SECONDS);
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
  const data = await fetchJson(`/${resource}?${q.toString()}`, SEO_REVALIDATE_SECONDS);
  const list = Array.isArray(data) ? data : [];
  if (list.length >= Math.min(4, limit)) return list;
  // Fallback: city-agnostic featured list so landings never look empty
  const fallback = await fetchCatalogList(resource, limit);
  return fallback;
}

export async function fetchBlogBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/blogs/${encodeURIComponent(slug)}`, SEO_REVALIDATE_SECONDS);
}

export async function fetchSeoServiceBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/seo-services/${encodeURIComponent(slug)}`, SEO_REVALIDATE_SECONDS);
}

export async function fetchSeoRouteBySlug(slug) {
  if (!slug) return null;
  return fetchJson(`/seo-routes/${encodeURIComponent(slug)}`, SEO_REVALIDATE_SECONDS);
}

/** Admin-managed meta for /cab-booking/{city} and /acting-driver/{city}. */
export async function fetchSeoCityPage(pageType, citySlug) {
  if (!pageType || !citySlug) return null;
  return fetchJson(`/seo-city-pages/${encodeURIComponent(pageType)}/${encodeURIComponent(citySlug)}`, SEO_REVALIDATE_SECONDS);
}

export async function fetchSeoMenuLinks() {
  const data = await fetchJson("/seo-menu", SEO_REVALIDATE_SECONDS);
  return Array.isArray(data) ? data : [];
}

export async function fetchHomeShowcase(section) {
  const data = await fetchJson(`/offers?section=${encodeURIComponent(section)}`, SEO_REVALIDATE_SECONDS);
  const rows = Array.isArray(data) ? data.filter((o) => o?.title && o.published !== false) : [];
  if (rows.length) return rows;
  return SHOWCASE_FALLBACKS[section] || SHOWCASE_FALLBACKS.offers || [];
}

export async function fetchHomeCallDriverServices() {
  const data = await fetchJson("/call-driver", SEO_REVALIDATE_SECONDS);
  return mergeCallDriverServices(data?.services);
}
