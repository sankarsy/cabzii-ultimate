import { SITE_URL } from "../lib/seo";

/**
 * Private, transactional, duplicate or thin pages — not for indexing.
 */
const DISALLOW = [
  "/admin",
  "/api/",
  "/account",
  "/payment",
  "/booking",
  "/my-bookings",
  "/login",
  "/signin",
  "/search",
  "/tour-booking",
  "/buses",
  "/trains",
  "/flights",
  "/hotels",
  "/cabs/results",
  "/drivers/results",
  "/*?source=pwa",
  "/*?*sort=",
  "/*?*filter=",
  "/*?*page="
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
