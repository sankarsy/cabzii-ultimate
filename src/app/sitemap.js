import {
  SEO_CITIES,
  SEO_ROUTES,
  SEO_SERVICES,
  SITE_URL,
  getBackendUrl,
  servicePath
} from "../lib/seo";
import { classifyCityHub, classifyRoute, classifyServiceCity } from "../lib/seo/indexation";
import { catalogPublicPath } from "../lib/catalogProduct";
import { isLiveApiHostProtected } from "../lib/liveApiHostGuard";
import { resolveProductImageSeo } from "../lib/dynamicImageSeo";
import { dedupeSitemapEntries, isPublishedBlogPost, isPublishedCatalogItem } from "../lib/seo/sitemapUtils";

const HERO_IMAGE = `${SITE_URL}/images/hero-banner.svg`;

function sitemapImageFromProduct(item, kind) {
  if (!item) return null;
  const seo = resolveProductImageSeo(item, { kind });
  return seo.sitemapImage?.url || seo.absoluteUrl || null;
}

async function fetchAllIds(path, maxPages = 25) {
  if (isLiveApiHostProtected()) return [];
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
    { url: `${base}/tariff`, lastModified: now, changeFrequency: "weekly", priority: 0.9, images: [HERO_IMAGE] },
    { url: `${base}/call-driver`, lastModified: now, changeFrequency: "weekly", priority: 0.95, images: [HERO_IMAGE] },
    { url: `${base}/acting-driver`, lastModified: now, changeFrequency: "weekly", priority: 0.9, images: [HERO_IMAGE] },
    { url: `${base}/cab-booking`, lastModified: now, changeFrequency: "weekly", priority: 0.88, images: [HERO_IMAGE] },
    { url: `${base}/drivers`, lastModified: now, changeFrequency: "weekly", priority: 0.7, images: [HERO_IMAGE] },
    { url: `${base}/holidays`, lastModified: now, changeFrequency: "daily", priority: 0.92, images: [HERO_IMAGE] },
    { url: `${base}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.88, images: [HERO_IMAGE] },
    { url: `${base}/routes`, lastModified: now, changeFrequency: "weekly", priority: 0.88, images: [HERO_IMAGE] },
    { url: `${base}/blogs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.78 },
    { url: `${base}/track-booking`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/testimonials`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal-declaration`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 }
  ];

  const cityRoutes = SEO_CITIES.flatMap((city) => {
    const cabPolicy = classifyCityHub(city.slug, "cab-booking");
    const driverPolicy = classifyCityHub(city.slug, "acting-driver");
    const rows = [];
    if (cabPolicy.indexable) {
      rows.push({
        url: `${base}/cab-booking/${city.slug}`,
        lastModified: now,
        changeFrequency: cabPolicy.changeFrequency,
        priority: cabPolicy.sitemapPriority
      });
    }
    if (driverPolicy.indexable) {
      rows.push({
        url: `${base}/acting-driver/${city.slug}`,
        lastModified: now,
        changeFrequency: driverPolicy.changeFrequency,
        priority: driverPolicy.sitemapPriority
      });
    }
    return rows;
  });

  const [cabs, packages, blogPosts, cmsServices, cmsRoutes] = await Promise.all([
    fetchAllIds("/cabs"),
    fetchAllIds("/packages"),
    fetchAllIds("/blogs"),
    fetchAllIds("/seo-services"),
    fetchAllIds("/seo-routes")
  ]);

  const cmsServiceSlugs = new Set((cmsServices || []).filter((s) => s.slug && s.published !== false).map((s) => s.slug));
  const cmsRouteSlugs = new Set((cmsRoutes || []).filter((r) => r.slug && r.published !== false).map((r) => r.slug));

  const staticServiceRoutes = SEO_CITIES.flatMap((city) =>
    SEO_SERVICES.filter((service) => !cmsServiceSlugs.has(service.slug))
      .map((service) => {
        const policy = classifyServiceCity(service.slug, city.slug);
        if (!policy.indexable) return null;
        return {
          url: `${base}${servicePath(service, city)}`,
          lastModified: now,
          changeFrequency: policy.changeFrequency,
          priority: policy.sitemapPriority
        };
      })
      .filter(Boolean)
  );

  const cmsServiceRoutes = (cmsServices || [])
    .filter((service) => service.slug && service.published !== false)
    .flatMap((service) => {
      const cities = service.allCities !== false
        ? SEO_CITIES
        : SEO_CITIES.filter((city) => (service.citySlugs || []).includes(city.slug));
      return cities
        .map((city) => {
          const policy = classifyServiceCity(service.slug, city.slug);
          if (!policy.indexable) return null;
          return {
            url: `${base}/services/${service.slug}/${city.slug}`,
            lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
            changeFrequency: policy.changeFrequency,
            priority: policy.sitemapPriority
          };
        })
        .filter(Boolean);
    });

  const staticRoutePages = SEO_ROUTES.filter((route) => !cmsRouteSlugs.has(route.slug))
    .map((route) => {
      const policy = classifyRoute(route);
      if (!policy.indexable) return null;
      return {
        url: `${base}/routes/${route.slug}`,
        lastModified: now,
        changeFrequency: policy.changeFrequency,
        priority: policy.sitemapPriority
      };
    })
    .filter(Boolean);

  const cmsRoutePages = (cmsRoutes || [])
    .filter((route) => route.slug && route.published !== false)
    .map((route) => {
      const policy = classifyRoute(
        {
          slug: route.slug,
          from: route.fromCitySlug,
          to: route.toCitySlug,
          distance: route.distance
        },
        { source: "cms" }
      );
      if (!policy.indexable) return null;
      return {
        url: `${base}/routes/${route.slug}`,
        lastModified: route.updatedAt ? new Date(route.updatedAt) : now,
        changeFrequency: policy.changeFrequency,
        priority: policy.sitemapPriority
      };
    })
    .filter(Boolean);

  const cabRoutes = cabs
    .filter(isPublishedCatalogItem)
    .map((item) => {
      const image = sitemapImageFromProduct(item, "cab");
      return {
        url: `${base}${catalogPublicPath(item, "/cabs")}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.7,
        ...(image ? { images: [image] } : {})
      };
    });

  const tourPackageSlugs = new Set(
    packages.filter((item) => item.slug).map((item) => String(item.slug))
  );

  /* Booking pages at /holidays/{slug|id}; SEO landings stay at /tour-packages/{slug} */
  const packageRoutes = packages.filter(isPublishedCatalogItem).map((item) => {
    const image = sitemapImageFromProduct(item, "holiday");
    const hasSeoLanding = item.slug && tourPackageSlugs.has(String(item.slug));
    return {
      url: `${base}${catalogPublicPath(item, "/holidays")}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: "weekly",
      priority: hasSeoLanding ? 0.55 : 0.65,
      ...(image ? { images: [image] } : {})
    };
  });

  const tourPackageRoutes = packages
    .filter(isPublishedCatalogItem)
    .filter((item) => item.slug)
    .map((item) => {
      const image = sitemapImageFromProduct(item, "holiday");
      return {
        url: `${base}/tour-packages/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.85,
        ...(image ? { images: [image] } : {})
      };
    });

  const blogRoutes = blogPosts
    .filter(isPublishedBlogPost)
    .map((item) => {
      const image = sitemapImageFromProduct(
        { image: item.coverImage || item.ogImage || item.image, imageAlt: item.title },
        "default"
      );
      return {
        url: `${base}/blog/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
        changeFrequency: "monthly",
        priority: item.slug?.includes("chennai") ? 0.82 : 0.6,
        ...(image ? { images: [image] } : {})
      };
    });

  return dedupeSitemapEntries([
    ...staticRoutes,
    ...cityRoutes,
    ...staticServiceRoutes,
    ...cmsServiceRoutes,
    ...staticRoutePages,
    ...cmsRoutePages,
    ...cabRoutes,
    ...packageRoutes,
    ...tourPackageRoutes,
    ...blogRoutes
  ]);
}
