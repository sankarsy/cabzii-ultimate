export const SITE_URL = "https://cabzii.in";
export const SITE_NAME = "Cabzii";
export const BRAND = "cabzii";

export const DEFAULT_KEYWORDS = [
  "cabzii",
  "cabzii.in",
  "cab booking online",
  "taxi booking India",
  "acting driver Chennai",
  "acting driver hire",
  "cab booking Chennai",
  "outstation cab",
  "airport taxi",
  "driver on rent",
  "tour packages India",
  "online cab booking"
];

/** Major cities for SEO landing pages (slug → display name). */
export const SEO_CITIES = [
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu" },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra" },
  { slug: "delhi", name: "Delhi", state: "Delhi NCR" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal" },
  { slug: "pune", name: "Pune", state: "Maharashtra" },
  { slug: "coimbatore", name: "Coimbatore", state: "Tamil Nadu" },
  { slug: "madurai", name: "Madurai", state: "Tamil Nadu" },
  { slug: "trichy", name: "Trichy", state: "Tamil Nadu" },
  { slug: "kochi", name: "Kochi", state: "Kerala" },
  { slug: "goa", name: "Goa", state: "Goa" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat" },
  { slug: "chandigarh", name: "Chandigarh", state: "Punjab" }
];

export function getBackendUrl() {
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
}

export function cityBySlug(slug) {
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function cabBookingTitle(cityName) {
  return `Cab & Taxi Booking in ${cityName} | ${SITE_NAME}`;
}

export function cabBookingDescription(cityName, state) {
  return `Book cabs and taxis in ${cityName}, ${state} with ${SITE_NAME}. Outstation, airport, local rental and transparent fares — instant online booking.`;
}

export function actingDriverTitle(cityName) {
  return `Acting Driver in ${cityName} | Hire Chauffeur | ${SITE_NAME}`;
}

export function actingDriverDescription(cityName, state) {
  return `Hire acting drivers and chauffeurs in ${cityName}, ${state}. Hourly, daily and outstation driver service with verified partners on ${SITE_NAME}.`;
}

export const homeMetadata = {
  title: "Cabzii — Online Cab, Taxi & Acting Driver Booking in India",
  description:
    "Cabzii (cabzii.in) is India's trusted platform to book cabs, taxis, acting drivers and tour packages. Compare fares, book instantly in Chennai, Bengaluru, Mumbai and 50+ cities.",
  alternates: { canonical: "/" },
  keywords: [
    ...DEFAULT_KEYWORDS,
    "book cab online India",
    "Cabzii cab booking",
    "acting driver Bengaluru",
    "taxi Chennai"
  ],
  openGraph: {
    title: "Cabzii — Book Cabs, Acting Drivers & Tours",
    description: "Online cab, taxi, acting driver and tour booking with transparent pricing across India.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website"
  }
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/hero-banner.png`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9944197416",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Tamil"]
    }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function localBusinessJsonLd(cityName) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} — ${cityName}`,
    url: SITE_URL,
    description: `Cab and acting driver booking in ${cityName} via ${SITE_NAME}.`,
    areaServed: cityName,
    priceRange: "₹₹"
  };
}
