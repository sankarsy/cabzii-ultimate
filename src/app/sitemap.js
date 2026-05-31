import {
  SEO_CITIES,
  SEO_ROUTES,
  SEO_SERVICES,
  SITE_URL,
  getBackendUrl,
  servicePath
} from "../lib/seo";
import { resolveMediaUrl } from "../lib/media";

const HERO_IMAGE = `${SITE_URL}/images/hero-banner.png`;

/** Return an absolute image URL for the sitemap, or null when unavailable. */
function absoluteImage(path) {
  const resolved = resolveMediaUrl(path);
  if (!resolved) return null;
  if (/^https?:\/\//i.test(resolved)) return resolved;
  return `${SITE_URL}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}

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
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1, images: [HERO_IMAGE] },
    { url: `${base}/cabs`, lastModified: now, changeFrequency: "daily", priority: 0.95, images: [HERO_IMAGE] },
    { url: `${base}/drivers`, lastModified: now, changeFrequency: "daily", priority: 0.95, images: [HERO_IMAGE] },
    { url: `${base}/holidays`, lastModified: now, changeFrequency: "daily", priority: 0.92, images: [HERO_IMAGE] },
    { url: `${base}/flights`, lastModified: now, changeFrequency: "daily", priority: 0.88 },
    { url: `${base}/hotels`, lastModified: now, changeFrequency: "daily", priority: 0.88 },
    { url: `${base}/holidays?category=pilgrimage`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal-declaration`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 }
  ];

  const cityRoutes = SEO_CITIES.flatMap((city) => {
    const isChennai = city.slug === "chennai";
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
        priority: city.slug === "tirupati" ? 0.95 : 0.9
      }
    ];
  });

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

  const cabRoutes = cabs.map((item) => {
    const image = absoluteImage(item.image);
    return {
      url: `${base}/cabs/${item._id}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(image ? { images: [image] } : {})
    };
  });

  const driverRoutes = drivers.map((item) => {
    const image = absoluteImage(item.image);
    return {
      url: `${base}/drivers/${item._id}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(image ? { images: [image] } : {})
    };
  });

  const packageRoutes = packages
    .filter((item) => item._id)
    .map((item) => {
      const image = absoluteImage(item.image);
      return {
        url: `${base}/holidays/${item._id}`,
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
