export const SITE_URL = "https://cabzii.in";
export const SITE_NAME = "Cabzii";
export const BRAND = "cabzii";
export const SITE_LOGO = `${SITE_URL}/images/hero-banner.png`;
/** Default social / OG image (absolute URL for crawlers). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-banner.png`;

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
  process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/cabzii",
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/cabzii",
  process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/cabzii",
  process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/cabzii",
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@cabzii"
].filter(Boolean);

/** Wikidata entity URI for this organization, if one exists (e.g. https://www.wikidata.org/wiki/Q123). */
export const WIKIDATA_URL = process.env.NEXT_PUBLIC_WIKIDATA_URL || "";

/** Google Knowledge Graph entity id (kg:/g/...) once Google assigns one. */
export const KNOWLEDGE_GRAPH_ID = process.env.NEXT_PUBLIC_KNOWLEDGE_GRAPH_ID || "";

/** Verified customer reviews on /testimonials — used in AggregateRating schema. */
export const SITE_REVIEW_STATS = {
  ratingValue: "4.9",
  reviewCount: "6",
  bestRating: "5",
  worstRating: "1"
};

/** Typical fare ranges (INR) for city landing rich snippets. */
export const CITY_CAB_PRICE_RANGE = { low: 999, high: 6500 };
export const CITY_DRIVER_PRICE_RANGE = { low: 899, high: 4200 };

export const DEFAULT_KEYWORDS = [
  "cabzii",
  "cabzii.in",
  "cab booking online",
  "taxi booking India",
  "cab booking Chennai",
  "taxi booking near me",
  "airport taxi Chennai",
  "outstation cab Bangalore",
  "one way cab Chennai to Bangalore",
  "driver on hire Chennai",
  "acting driver Chennai",
  "cab rental Chennai",
  "car rental Bangalore",
  "tempo traveller rental",
  "local taxi service",
  "airport pickup service",
  "chauffeur service Chennai",
  "cheap taxi booking",
  "best cab service in Chennai",
  "car rental in chennai",
  "car rental near me",
  "travels in chennai",
  "travels near me",
  "tour packages South India"
];

export function getBackendUrl() {
  const url =
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return url.trim().replace(/\/+$/, "");
}

/** Shared Next.js metadata (title, description, canonical, OG, Twitter). */
export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
  imageAlt,
  noindex = false,
  languages
}) {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const ogImage = image?.startsWith("http")
    ? image
    : image
      ? `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`
      : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
      ...(languages ? { languages } : {})
    },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: ogImage, alt: imageAlt || title, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
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
  return `Hire acting drivers and chauffeurs in ${cityName}, ${state}. Hourly, daily and outstation driver service with verified partners on ${SITE_NAME}.`;
}

export const homeMetadata = buildPageMetadata({
  title: "Cabzii — Online Cab, Taxi & Driver Booking in South India",
  description:
    "Book cabs, taxis, airport transfers, outstation trips, acting drivers and tempo travellers in Chennai, Bengaluru, Hyderabad and 20+ cities. Transparent fares. Instant OTP booking on cabzii.in.",
  path: "/",
  image: "/images/hero-banner.png",
  imageAlt: "Book cabs and taxis online with Cabzii",
  keywords: [
    ...DEFAULT_KEYWORDS,
    "book cab online India",
    "Cabzii cab booking",
    "taxi Chennai",
    "cab booking South India"
  ]
});
