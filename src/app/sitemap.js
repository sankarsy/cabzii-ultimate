import {
  SEO_CITIES,
  SEO_ROUTES,
  SEO_SERVICES,
  SITE_URL,
  getBackendUrl,
  servicePath
} from "../lib/seo";
import { catalogPublicPath } from "../lib/catalogProduct";
import { resolveMediaUrl } from "../lib/media";

const HERO_IMAGE = `${SITE_URL}/images/hero-banner.png`;

function absoluteImage(path) {
  const resolved = resolveMediaUrl(path);
  if (!resolved) return null;
  if (/^https?:\/\//i.test(resolved)) return resolved;
  return `${SITE_URL}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}

async function fetchAllIds(path, maxPages = 25) {
  const backend = getBackendUrl();
  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    try {
      const res = await fetch(`${backend}/api/v1${path}?limit=100&page=${page}`, {
        next: { revalidate: 3600 }
      });
      if (!res.ok) break;
      const json = await res.json();
      const batch = Array.isArray(json?.data) ? json.data : [];
      if (!batch.length) break;
      all.push(...batch);
      if (batch.length < 100) break;
    } catch {
      break;
    }
  }
  return all;
}

export default async function sitemap() {
  const base = SITE_URL;
  const now = new Date();

  const staticRoutes = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1, images: [HERO_IMAGE] },
    { url: `${base}/cabs`, lastModified: now, changeFrequency: "daily", priority: 0.95, images: [HERO_IMAGE] },
    { url: `${base}/drivers`, lastModified: now, changeFrequency: "daily", priority: 0.95, images: [HERO_IMAGE] },
    { url: `${base}/holidays`, lastModified: now, changeFrequency: "daily", priority: 0.92, images: [HERO_IMAGE] },
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/cab-booking-in-chennai-complete-guide-2026`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/holidays?category=pilgrimage`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal-declaration`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 }
  ];

  const cityRoutes = SEO_CITIES.flatMap((city) => {
    const isChennai = city.slug === "chennai";
    const isTirupati = city.slug === "tirupati";
    return [
      {
        url: `${base}/cab-booking/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: isChennai ? 0.98 : 0.92
      },
      {
        url: `${base}/acting-driver/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: isTirupati ? 0.96 : isChennai ? 0.94 : 0.9
      }
    ];
  });

  const [cabs, drivers, packages, blogPosts, cmsServices, cmsRoutes] = await Promise.all([
    fetchAllIds("/cabs"),
    fetchAllIds("/drivers"),
    fetchAllIds("/packages"),
    fetchAllIds("/blogs"),
    fetchAllIds("/seo-services"),
    fetchAllIds("/seo-routes")
  ]);

  const cmsServiceSlugs = new Set((cmsServices || []).filter((s) => s.slug && s.published !== false).map((s) => s.slug));
  const cmsRouteSlugs = new Set((cmsRoutes || []).filter((r) => r.slug && r.published !== false).map((r) => r.slug));

  const staticServiceRoutes = SEO_CITIES.flatMap((city) =>
    SEO_SERVICES.filter((service) => !cmsServiceSlugs.has(service.slug)).map((service) => ({
      url: `${base}${servicePath(service, city)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: city.slug === "chennai" && ["car-rental", "cab-rental", "airport-taxi"].includes(service.slug) ? 0.9 : 0.86
    }))
  );

  const cmsServiceRoutes = (cmsServices || [])
    .filter((service) => service.slug && service.published !== false)
    .flatMap((service) => {
      const cities = service.allCities !== false
        ? SEO_CITIES
        : SEO_CITIES.filter((city) => (service.citySlugs || []).includes(city.slug));
      return cities.map((city) => ({
        url: `${base}/services/${service.slug}/${city.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.86
      }));
    });

  const staticRoutePages = SEO_ROUTES.filter((route) => !cmsRouteSlugs.has(route.slug)).map((route) => ({
    url: `${base}/routes/${route.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route.slug.includes("tirupati") || route.slug.includes("chennai") ? 0.9 : 0.87
  }));

  const cmsRoutePages = (cmsRoutes || [])
    .filter((route) => route.slug && route.published !== false)
    .map((route) => ({
      url: `${base}/routes/${route.slug}`,
      lastModified: route.updatedAt ? new Date(route.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.87
    }));

  const cabRoutes = cabs
    .filter((item) => item._id || item.slug)
    .map((item) => {
      const image = absoluteImage(item.image);
      return {
        url: `${base}${catalogPublicPath(item, "/cabs")}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
        ...(image ? { images: [image] } : {})
      };
    });

  const driverRoutes = drivers
    .filter((item) => item._id || item.slug)
    .map((item) => {
      const image = absoluteImage(item.image);
      return {
        url: `${base}${catalogPublicPath(item, "/drivers")}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
        ...(image ? { images: [image] } : {})
      };
    });

  const packageRoutes = packages
    .filter((item) => item._id || item.slug)
    .map((item) => {
      const image = absoluteImage(item.image);
      return {
        url: `${base}${catalogPublicPath(item, "/holidays")}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.65,
        ...(image ? { images: [image] } : {})
      };
    });

  const blogRoutes = blogPosts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${base}/blog/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "monthly",
      priority: item.slug?.includes("chennai") ? 0.82 : 0.6
    }));

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...staticServiceRoutes,
    ...cmsServiceRoutes,
    ...staticRoutePages,
    ...cmsRoutePages,
    ...cabRoutes,
    ...driverRoutes,
    ...packageRoutes,
    ...blogRoutes
  ];
}
