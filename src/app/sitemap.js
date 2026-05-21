import { SEO_CITIES, SITE_URL, getBackendUrl } from "../lib/seo";

async function fetchIds(path) {
  const backend = getBackendUrl();
  try {
    const res = await fetch(`${backend}/api/v1${path}?limit=100&page=1`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const base = SITE_URL;
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cabs`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/drivers`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/packages`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal-declaration`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 }
  ];

  const cityRoutes = SEO_CITIES.flatMap((city) => [
    {
      url: `${base}/cab-booking/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88
    },
    {
      url: `${base}/acting-driver/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88
    }
  ]);

  const [cabs, drivers, packages] = await Promise.all([
    fetchIds("/cabs"),
    fetchIds("/drivers"),
    fetchIds("/packages")
  ]);

  const cabRoutes = cabs.map((item) => ({
    url: `${base}/cabs/${item._id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const driverRoutes = drivers.map((item) => ({
    url: `${base}/drivers/${item._id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const packageRoutes = packages.map((item) => ({
    url: `${base}/packages/${item._id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.65
  }));

  return [...staticRoutes, ...cityRoutes, ...cabRoutes, ...driverRoutes, ...packageRoutes];
}
