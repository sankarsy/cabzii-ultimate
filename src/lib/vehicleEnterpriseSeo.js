import { SITE_URL } from "./seo/constants";

export const SEO_KEYWORD_SUGGESTIONS = [
  "tempo traveller",
  "17 seater",
  "chennai",
  "airport taxi",
  "cab rental",
  "outstation cab",
  "local taxi",
  "corporate travel",
  "innova crysta",
  "sedan taxi"
];

export const HIGHLIGHT_PRESETS = [
  "Verified Drivers",
  "24x7 Support",
  "Sanitized Vehicles",
  "No Hidden Charges",
  "Fast Booking",
  "Professional Drivers",
  "OTP Secure",
  "Upfront Fares"
];

export const FEATURE_MULTI_SELECT = [
  "AC",
  "Music System",
  "USB Charging",
  "Push Back Seats",
  "Luggage",
  "WiFi",
  "GPS",
  "Bottle Holder",
  "Emergency Kit",
  "FastTag",
  "Child Seat"
];

export const ROBOTS_OPTIONS = [
  { value: "index,follow", label: "Index, Follow" },
  { value: "noindex,follow", label: "NoIndex" },
  { value: "index,nofollow", label: "NoFollow" },
  { value: "noindex,nofollow", label: "NoIndex NoFollow" }
];

export const NEARBY_LOCATION_PRESETS = [
  "Tambaram",
  "Velachery",
  "Anna Nagar",
  "Porur",
  "T Nagar",
  "Guindy",
  "Adyar",
  "OMR"
];

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function seoVars(form = {}) {
  const vehicle = form.vehicleName || form.title || form.name || "Cab";
  const city = form.city || "Chennai";
  const state = form.state || "Tamil Nadu";
  const price =
    num(form.pricePerKm) > 0
      ? `₹${num(form.pricePerKm)}/km`
      : `₹${num(form.startingPrice || form.price).toLocaleString("en-IN")}`;
  return {
    vehicle,
    city,
    state,
    price,
    brand: form.brand || form.brandName || "Cabzii",
    seats: String(form.seats || ""),
    fuel: form.fuelType || "",
    transmission: form.transmission || ""
  };
}

export function applySeoTemplate(template, form) {
  const vars = seoVars(form);
  return String(template || "").replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

export const SEO_TEMPLATES = {
  title: "Book {{vehicle}} Rental in {{city}}, {{state}} | Cabzii",
  description:
    "Book {{vehicle}} rental in {{city}}, {{state}} starting from {{price}}. Airport transfer, local, outstation and corporate travel with Cabzii.",
  h1: "{{vehicle}} Rental in {{city}}",
  slug: "{{vehicle}} {{seats}} seater {{city}}"
};

export function slugifySeo(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function generateSlug(form) {
  const vars = seoVars(form);
  const raw = `${vars.vehicle} ${vars.seats ? `${vars.seats} seater` : ""} ${vars.city}`.trim();
  return slugifySeo(raw) || "cab-rental";
}

export function generateCanonical(form, pathPrefix = "/cabs") {
  const slug = form.slug || generateSlug(form);
  return `${SITE_URL}${pathPrefix}/${slug}`;
}

export function parseKeywords(value) {
  if (Array.isArray(value)) return value.map((k) => String(k).trim()).filter(Boolean);
  return String(value || "")
    .split(/[,|\n]+/)
    .map((k) => k.trim())
    .filter(Boolean);
}

export function keywordsToString(list) {
  return (Array.isArray(list) ? list : []).join(", ");
}

export function charTone(len, softMax, hardMax) {
  if (len <= softMax) return "green";
  if (len <= hardMax) return "orange";
  return "red";
}

export function wordCount(htmlOrText) {
  const text = String(htmlOrText || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

export function readingTimeMinutes(words) {
  return Math.max(1, Math.ceil(words / 200));
}

export function buildVehicleJsonLd(form, pathPrefix = "/cabs") {
  const vars = seoVars(form);
  const url = form.canonicalUrl || generateCanonical(form, pathPrefix);
  const price = num(form.startingPrice || form.price || form.pricePerKm);
  const faqs = (form.faq || []).filter((f) => f.question?.trim() && f.answer?.trim());
  const reviews = (form.seoReviews || []).filter((r) => r.review?.trim());
  const ratingValue = num(form.rating) || (reviews.length ? reviews.reduce((s, r) => s + num(r.rating), 0) / reviews.length : 0);
  const reviewCount = num(form.reviewCount) || reviews.length;

  const graph = [
    {
      "@type": "Product",
      name: form.seoTitle || form.h1 || vars.vehicle,
      description: form.seoDescription || form.shortDescription || "",
      brand: { "@type": "Brand", name: vars.brand },
      image: form.ogImage || form.image || "",
      offers: {
        "@type": "Offer",
        priceCurrency: form.currency || "INR",
        price: String(price || 0),
        availability: "https://schema.org/InStock",
        url
      }
    },
    {
      "@type": "RentalCarReservation",
      name: `${vars.vehicle} rental in ${vars.city}`,
      provider: { "@type": "Organization", name: "Cabzii", url: SITE_URL }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Cabs", item: `${SITE_URL}/cabs` },
        { "@type": "ListItem", position: 3, name: vars.vehicle, item: url }
      ]
    },
    {
      "@type": "Organization",
      name: "Cabzii",
      url: SITE_URL,
      logo: `${SITE_URL}/images/hero-banner.png`
    },
    {
      "@type": "LocalBusiness",
      name: `Cabzii ${vars.city}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: vars.city,
        addressRegion: vars.state,
        addressCountry: "IN"
      },
      url: SITE_URL
    },
    {
      "@type": "WebSite",
      name: "Cabzii",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer }
      }))
    });
  }

  if (ratingValue > 0 && reviewCount > 0) {
    graph[0].aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount
    };
  }

  if (reviews.length) {
    graph[0].review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name || "Customer" },
      reviewRating: { "@type": "Rating", ratingValue: num(r.rating, 5) },
      reviewBody: r.review,
      ...(r.location ? { locationCreated: r.location } : {})
    }));
  }

  if (form.youtubeUrl) {
    graph.push({
      "@type": "VideoObject",
      name: form.seoTitle || vars.vehicle,
      description: form.seoDescription || "",
      thumbnailUrl: form.ogImage || form.image || "",
      contentUrl: form.youtubeUrl,
      embedUrl: form.youtubeUrl
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function computeSeoScore(form) {
  const checks = [];
  const titleLen = String(form.seoTitle || "").length;
  const descLen = String(form.seoDescription || "").length;
  const keywords = parseKeywords(form.metaKeywords || form.seo);
  const contentWords = wordCount(form.longSeoContent || form.shortDescription);
  const images = Array.isArray(form.images) ? form.images : [];
  const alts = images.filter((img) => img?.alt?.trim()).length;
  const faqs = (form.faq || []).filter((f) => f.question?.trim() && f.answer?.trim());
  const h2s = Array.isArray(form.h2) ? form.h2.filter(Boolean) : [];

  const add = (ok, warn, id, label, passMsg, failMsg) => {
    checks.push({
      id,
      label,
      status: ok ? "pass" : warn ? "warn" : "fail",
      message: ok ? passMsg : failMsg
    });
  };

  const primary = (keywords[0] || "").toLowerCase();
  const bodyText = String(form.longSeoContent || form.shortDescription || "")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();
  const density =
    primary && contentWords > 0
      ? (bodyText.split(primary).length - 1) / contentWords
      : 0;

  add(titleLen > 0 && titleLen <= 60, titleLen > 60 && titleLen <= 70, "title", "Title Length", "Title length is good", titleLen ? "Title too long or short" : "Missing SEO Title");
  add(descLen > 0 && descLen <= 160, descLen > 160 && descLen <= 180, "description", "Description Length", "Description length is good", descLen ? "Description too long/short" : "Missing Description");
  add(keywords.length > 0, false, "keywords", "Focus Keyword", "Keywords added", "No Keywords");
  add(Boolean(String(form.h1 || "").trim()), false, "h1", "H1 Exists", "H1 present", "Missing H1");
  add(h2s.length > 0, false, "h2", "H2 Exists", "H2 present", "Missing H2");
  add(contentWords >= 150, contentWords > 0, "content", "Content Length", "Content length is good", "Add more SEO content");
  add(density >= 0.005 && density <= 0.03, density > 0 && density < 0.005, "density", "Keyword Density", `Density ${(density * 100).toFixed(1)}%`, "Low keyword density");
  add(
    Boolean((form.relatedVehicles || []).length || (form.relatedCities || []).length || (form.relatedPackages || []).length),
    false,
    "links",
    "Internal Links",
    "Internal links set",
    "Add internal links"
  );
  add(images.length === 0 || alts === images.length, images.length > 0 && alts > 0, "alt", "Image ALT", "Image ALT texts set", "Missing ALT text");
  add(form.schemaEnabled !== false, false, "schema", "Schema", "Schema enabled", "Schema disabled");
  add(Boolean(String(form.canonicalUrl || "").trim()), false, "canonical", "Canonical", "Canonical set", "Missing Canonical");
  add(Boolean(String(form.robots || "index,follow").trim()), false, "robots", "Robots", "Robots set", "Missing Robots");
  add(Boolean(String(form.ogTitle || form.seoTitle || "").trim()), false, "og", "OpenGraph", "OpenGraph ready", "Missing OpenGraph title");
  add(Boolean(String(form.twitterTitle || form.ogTitle || form.seoTitle || "").trim()), false, "twitter", "Twitter", "Twitter card ready", "Missing Twitter title");
  add(faqs.length > 0, false, "faq", "FAQ", "FAQ added", "No FAQ");
  add(num(form.rating) > 0 || (form.seoReviews || []).length > 0, false, "reviews", "Reviews", "Reviews present", "No Reviews");
  add(contentWords >= 300, contentWords >= 100, "words", "Word Count", `${contentWords} words`, "Low word count");
  add(contentWords >= 100, false, "readability", "Readability", "Readable length", "Improve readability with more content");
  add(Boolean(String(form.slug || "").trim()), false, "slug", "Slug", "Slug set", "Missing Slug");

  const pass = checks.filter((c) => c.status === "pass").length;
  const score = Math.round((pass / checks.length) * 100);
  return { score, checks };
}

export function generateFaqSuggestions(form) {
  const v = seoVars(form);
  return [
    {
      question: `What is the fare for ${v.vehicle} in ${v.city}?`,
      answer: `${v.vehicle} rental in ${v.city} starts from ${v.price}. Exact package price is shown before payment on Cabzii.`
    },
    {
      question: `Is ${v.vehicle} available for airport transfer in ${v.city}?`,
      answer: `Yes. Book ${v.vehicle} for airport pickup and drop in ${v.city} with verified drivers on Cabzii.`
    },
    {
      question: `Does ${v.vehicle} support outstation trips from ${v.city}?`,
      answer: `Yes. ${v.vehicle} is available for outstation and one-way trips from ${v.city} with upfront fares.`
    }
  ];
}

export function emptySeoReview() {
  return { name: "", rating: 5, review: "", location: "" };
}

export function emptyEnterpriseSeoFields() {
  return {
    robots: "index,follow",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    h1: "",
    h2: [""],
    h3: [""],
    shortDescription: "",
    longSeoContent: "",
    highlights: [],
    state: "Tamil Nadu",
    nearbyLocations: [],
    nearbyAirports: [],
    nearbyStations: [],
    nearbyPlaces: [],
    priceUnit: "Per KM",
    offerText: "",
    offerEnds: "",
    youtubeUrl: "",
    seoReviews: [],
    relatedVehicles: [],
    relatedCities: [],
    relatedPackages: [],
    relatedBlogs: [],
    relatedServices: [],
    seoScore: 0
  };
}

/** Flatten nested enterpriseSeo onto a catalog/admin form object. */
export function flattenEnterpriseSeo(item = {}) {
  const es = item?.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {};
  const base = emptyEnterpriseSeoFields();
  return {
    ...base,
    ...es,
    h2: Array.isArray(es.h2) && es.h2.length ? es.h2 : base.h2,
    h3: Array.isArray(es.h3) && es.h3.length ? es.h3 : base.h3,
    highlights: Array.isArray(es.highlights) ? es.highlights : [],
    seoReviews: Array.isArray(es.seoReviews) ? es.seoReviews : [],
    nearbyLocations: Array.isArray(es.nearbyLocations) ? es.nearbyLocations : [],
    nearbyAirports: Array.isArray(es.nearbyAirports) ? es.nearbyAirports : [],
    nearbyStations: Array.isArray(es.nearbyStations) ? es.nearbyStations : [],
    nearbyPlaces: Array.isArray(es.nearbyPlaces) ? es.nearbyPlaces : [],
    relatedVehicles: Array.isArray(es.relatedVehicles) ? es.relatedVehicles : [],
    relatedCities: Array.isArray(es.relatedCities) ? es.relatedCities : [],
    relatedPackages: Array.isArray(es.relatedPackages) ? es.relatedPackages : [],
    relatedBlogs: Array.isArray(es.relatedBlogs) ? es.relatedBlogs : [],
    relatedServices: Array.isArray(es.relatedServices) ? es.relatedServices : []
  };
}

/** Build nested enterpriseSeo payload from a flat admin form. */
export function buildEnterpriseSeoPayload(form = {}) {
  return {
    robots: form.robots || "index,follow",
    ogTitle: form.ogTitle || "",
    ogDescription: form.ogDescription || "",
    ogImage: form.ogImage || "",
    twitterTitle: form.twitterTitle || "",
    twitterDescription: form.twitterDescription || "",
    twitterImage: form.twitterImage || "",
    h1: form.h1 || "",
    h2: (form.h2 || []).map((x) => String(x || "").trim()).filter(Boolean),
    h3: (form.h3 || []).map((x) => String(x || "").trim()).filter(Boolean),
    shortDescription: form.shortDescription || "",
    longSeoContent: form.longSeoContent || "",
    highlights: Array.isArray(form.highlights) ? form.highlights : [],
    state: form.state || "Tamil Nadu",
    nearbyLocations: form.nearbyLocations || [],
    nearbyAirports: form.nearbyAirports || [],
    nearbyStations: form.nearbyStations || [],
    nearbyPlaces: form.nearbyPlaces || [],
    priceUnit: form.priceUnit || "Per KM",
    offerText: form.offerText || "",
    offerEnds: form.offerEnds || "",
    youtubeUrl: form.youtubeUrl || "",
    seoReviews: (form.seoReviews || []).filter((r) => r?.review?.trim() || r?.name?.trim()),
    relatedVehicles: form.relatedVehicles || [],
    relatedCities: form.relatedCities || [],
    relatedPackages: form.relatedPackages || [],
    relatedBlogs: form.relatedBlogs || [],
    relatedServices: form.relatedServices || [],
    seoScore: computeSeoScore(form).score
  };
}

export function robotsIsNoindex(robots) {
  return String(robots || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .includes("noindex");
}

/** Merge enterprise SEO fields onto a public catalog item for rendering/metadata. */
export function withPublicEnterpriseSeo(item) {
  if (!item) return item;
  const flat = flattenEnterpriseSeo(item);
  return {
    ...item,
    ...flat,
    // Keep package string highlights when enterprise highlights empty
    highlights:
      Array.isArray(flat.highlights) && flat.highlights.length
        ? flat.highlights
        : item.highlights
  };
}
