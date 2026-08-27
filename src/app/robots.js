import { SITE_URL } from "../lib/seo";

/**
 * Private, transactional, duplicate or thin pages — not for indexing.
 * /buses stays crawlable so Google can see its noindex tag (do not robots-disallow it).
 * Hotels/flights/trains remain blocked.
 */
const DISALLOW = [
  "/admin",
  "/api/",
  "/account",
  "/payment",
  "/booking",
  "/my-bookings",
  "/quote",
  "/login",
  "/signin",
  "/search",
  "/tour-booking",
  "/buses/results",
  "/buses/seats",
  "/buses/passenger",
  "/trains",
  "/flights",
  "/hotels",
  "/cabs/results",
  "/cabs/passenger",
  "/drivers/results",
  "/drivers/passenger",
  "/call-driver/book",
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
        allow: ["/", "/_next/static/", "/_next/image", "/images/", "/uploads/"],
        disallow: DISALLOW
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/uploads/", "/images/", "/_next/image", "/opengraph-image"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
