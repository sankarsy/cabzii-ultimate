import { SITE_URL } from "../lib/seo";

/**
 * Private/transactional sections and duplicate-content URLs that should never
 * be indexed. Public marketing pages (cities, services, routes, cabs, drivers,
 * packages, blog) stay fully crawlable.
 */
const DISALLOW = [
  "/admin",
  "/api/",
  "/payment",
  "/booking",
  "/my-bookings",
  "/login",
  "/signin",
  "/search",
  "/tour-booking",
  "/*?source=pwa", // PWA start_url — avoid duplicate of "/"
  "/*?*sort=", // faceted/sorted listings
  "/*?*filter=",
  "/*?*page=" // paginated query params (canonical lives on clean URLs)
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW
      },
      {
        // Googlebot needs JS/CSS/images to render & rank pages correctly.
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/", "/_next/image", "/images/"],
        disallow: DISALLOW
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/_next/image"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
