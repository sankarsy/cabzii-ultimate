import {
  SEO_CITIES,
  SEO_ROUTES,
  SEO_SERVICES,
  SITE_URL,
  getBackendUrl,
  servicePath
} from "../lib/seo";

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
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
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
      priority: 0.92
    },
    {
      url: `${base}/acting-driver/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    }
  ]);

  const serviceRoutes = SEO_CITIES.flatMap((city) =>
    SEO_SERVICES.map((service) => ({
      url: `${base}${servicePath(service, city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88
    }))
  );

  const routePages = SEO_ROUTES.map((route) => ({
    url: `${base}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.87
  }));

  const [cabs, drivers, packages, blogPosts] = await Promise.all([
    fetchIds("/cabs"),
    fetchIds("/drivers"),
    fetchIds("/packages"),
    fetchIds("/blogs")
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
    url: `${base}/tour-booking?id=${item._id}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.65
  }));

  const blogRoutes = blogPosts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${base}/blog/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6
    }));

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...serviceRoutes,
    ...routePages,
    ...cabRoutes,
    ...driverRoutes,
    ...packageRoutes,
    ...blogRoutes
  ];
}
