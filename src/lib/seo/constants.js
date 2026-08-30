import { absoluteBrandUrl, BRAND_ICON, BRAND_OG_IMAGE, BRAND_TWITTER_IMAGE } from "../brandAssets";
import { formatSerpTitle } from "./programmaticMeta";
import { SOCIAL_LINK_LIST } from "../socialLinks";

export const SITE_URL = "https://www.cabzii.in";
export const SITE_NAME = "Cabzii";
export const BRAND = "cabzii";

export const SITE_LOGO = absoluteBrandUrl(BRAND_ICON);
/** Default social / OG image (absolute URL for crawlers). */
export const DEFAULT_OG_IMAGE = absoluteBrandUrl(BRAND_OG_IMAGE);
export const DEFAULT_TWITTER_IMAGE = absoluteBrandUrl(BRAND_TWITTER_IMAGE);

export const ORG_EMAIL = "support@cabzii.com";
export const ORG_PHONE = "+91-9944197416";
export const ORG_ADDRESS = {
  streetAddress: "Maduravoyal",
  addressLocality: "Chennai",
  addressRegion: "Tamil Nadu",
  postalCode: "600095",
  addressCountry: "IN"
};

/**
 * Verified public profiles for the Organization `sameAs` (entity reconciliation
 * for Google Knowledge Graph + AI answer engines). Update these to your real
 * handles, or override via env without code changes. Empty values are dropped.
 */
export const SOCIAL_PROFILES = [
  ...SOCIAL_LINK_LIST.map((l) => l.href),
  process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/cabzii",
  process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/cabzii",
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@cabzii"
].filter(Boolean);

/** Wikidata entity URI for this organization, if one exists (e.g. https://www.wikidata.org/wiki/Q123). */
export const WIKIDATA_URL = process.env.NEXT_PUBLIC_WIKIDATA_URL || "";

/** Google Knowledge Graph entity id (kg:/g/...) once Google assigns one. */
export const KNOWLEDGE_GRAPH_ID = process.env.NEXT_PUBLIC_KNOWLEDGE_GRAPH_ID || "";

/** Verified customer reviews on /testimonials — used in AggregateRating schema. */
/**
 * UI-only fallback labels — NEVER use in AggregateRating / review schema.
 * Real ratings come from fetchSiteReviewStats() (approved testimonials/reviews only).
 */
export const SITE_REVIEW_STATS = {
  ratingValue: "0",
  reviewCount: "0",
  bestRating: "5",
  worstRating: "1"
};

/** Typical fare ranges (INR) for city landing rich snippets. */
export const CITY_CAB_PRICE_RANGE = { low: 1200, high: 16500 };
export const CITY_DRIVER_PRICE_RANGE = { low: 500, high: 1300 };

export const DEFAULT_KEYWORDS = [
  "cab booking",
  "airport taxi",
  "outstation cab",
  "one-way cab",
  "acting driver",
  "car rental",
  "tempo traveller",
  "tour packages",
  "pilgrimage travel",
  "cabzii"
];

export function getBackendUrl() {
  const url =
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return url.trim().replace(/\/+$/, "");
}

/**
 * Homepage SERP title — keywords first so Google doesn’t collapse branded mobile results to “Cabzii”.
 * Keep under ~60 chars; end with brand.
 */
export const HOME_SEO_TITLE = "Cab Booking Chennai & Tamil Nadu Taxi | Airport & Outstation | Cabzii";

function normalizePath(path) {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

function absoluteUrl(path) {
  const normalized = normalizePath(path);
  return normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

function resolveOgImage(image) {
  if (!image) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return `${SITE_URL}${image}`;
  return `${SITE_URL}/${image}`;
}

/** Use absolute titles — avoid layout template appending `| Cabzii` twice. */
function titleMetadata(title) {
  const isAbsoluteSerpTitle =
    /\|\s*Cabzii\s*$/i.test(title) ||
    title.startsWith("Cabzii |") ||
    title.startsWith("Cabzii:") ||
    title.startsWith("Cabzii —") ||
    title.startsWith("Cabzii -");
  return isAbsoluteSerpTitle ? { absolute: title } : title;
}

function buildVerification(verification) {
  const google = verification?.google || process.env.GOOGLE_SITE_VERIFICATION;
  const bing = verification?.bing || process.env.BING_SITE_VERIFICATION;
  const yandex = verification?.yandex || process.env.YANDEX_SITE_VERIFICATION;
  const out = {};
  if (google) out.google = google;
  if (bing) out.other = { "msvalidate.01": bing };
  if (yandex) out.yandex = yandex;
  return Object.keys(out).length ? out : undefined;
}

/** Shared Next.js metadata (title, description, canonical, OG, Twitter). */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  url,
  type = "website",
  noindex = false,
  follow = true,
  languages,
  verification
}) {
  const canonicalPath = normalizePath(path);
  const pageUrl = absoluteUrl(url || canonicalPath);
  const ogImage = image ? resolveOgImage(image) : null;

  return {
    title: titleMetadata(title),
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    referrer: "strict-origin-when-cross-origin",
    formatDetection: {
      telephone: true,
      email: true,
      address: false
    },
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: pageUrl,
      ...(languages ? { languages } : {})
    },
    robots: noindex
      ? { index: false, follow: Boolean(follow), googleBot: { index: false, follow: Boolean(follow) } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type,
      ...(ogImage
        ? { images: [{ url: ogImage, alt: imageAlt || title, width: imageWidth, height: imageHeight }] }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {})
    },
    ...(buildVerification(verification) ? { verification: buildVerification(verification) } : {}),
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-title": "Cabzii Cabs",
      "apple-mobile-web-app-status-bar-style": "default",
      "mobile-web-app-capable": "yes"
    }
  };
}

export function cabBookingTitle(cityName) {
  return `Cab Booking ${cityName} | Taxi & Outstation Cabs | Cabzii`;
}

export function cabBookingDescription(cityName, state) {
  return `Book cabs and taxis in ${cityName}, ${state} with ${SITE_NAME}. Airport pickup, outstation, local rental, acting driver and transparent fares — instant online booking.`;
}

export function actingDriverTitle(cityName) {
  return `Acting Driver ${cityName} | Driver on Hire | Cabzii`;
}

export function actingDriverDescription(cityName, state) {
  return `Hire an acting driver in ${cityName}, ${state} for your own car. Hourly, daily and outstation chauffeur packages on ${SITE_NAME} — a driver is assigned after you book.`;
}

export const homeMetadata = buildPageMetadata({
  title: HOME_SEO_TITLE,
  description:
    "Book cabs from Chennai and across Tamil Nadu with Cabzii — airport taxi, local packages, outstation and one-way trips. Transparent fares and WhatsApp support.",
  path: "/",
  image: "/opengraph-image",
  imageAlt: "Cabzii — Cab Booking Chennai & Tamil Nadu",
  keywords: [
    "cab booking chennai",
    "airport taxi chennai",
    "outstation cab chennai",
    "one way cab chennai",
    "acting driver chennai",
    "car rental chennai",
    "pilgrimage cab chennai",
    ...DEFAULT_KEYWORDS
  ]
});
