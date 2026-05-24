export const SITE_URL = "https://cabzii.in";
export const SITE_NAME = "Cabzii";
export const BRAND = "cabzii";

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
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
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
      : undefined;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
      ...(languages ? { languages } : {})
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, alt: imageAlt || title }] } : {})
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {})
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
  keywords: [
    ...DEFAULT_KEYWORDS,
    "book cab online India",
    "Cabzii cab booking",
    "taxi Chennai",
    "cab booking South India"
  ]
});
