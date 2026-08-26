import { HOME_PAGE_FAQS } from "./content";
import { badgesToSchemaProperties, SITE_SITELINKS } from "./serpRichData";
import { absoluteImageUrl } from "../imageOptimize";
import {
  SITE_URL,
  SITE_NAME,
  SITE_LOGO,
  ORG_EMAIL,
  ORG_PHONE,
  ORG_ADDRESS,
  SOCIAL_PROFILES,
  WIKIDATA_URL,
  KNOWLEDGE_GRAPH_ID,
  DEFAULT_OG_IMAGE,
  CITY_CAB_PRICE_RANGE,
  CITY_DRIVER_PRICE_RANGE
} from "./constants";

/** Stable @id for the Organization entity, referenced by other schema nodes. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

function priceValidUntil() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

export function siteAggregateRating(overrides = {}) {
  const ratingValue = overrides.ratingValue;
  const reviewCount = overrides.reviewCount;
  if (!ratingValue || !Number(reviewCount)) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: overrides.bestRating ?? "5",
    worstRating: overrides.worstRating ?? "1"
  };
}

function buildOffers({ url, price, lowPrice, highPrice, offerCount }) {
  const base = {
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    priceValidUntil: priceValidUntil(),
    seller: { "@id": ORG_ID }
  };
  if (lowPrice != null && highPrice != null && Number(lowPrice) !== Number(highPrice)) {
    return {
      "@type": "AggregateOffer",
      ...base,
      lowPrice: String(lowPrice),
      highPrice: String(highPrice),
      ...(offerCount ? { offerCount: String(offerCount) } : {})
    };
  }
  const single = price ?? lowPrice ?? highPrice;
  return {
    "@type": "Offer",
    ...base,
    ...(single != null ? { price: String(single) } : {})
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`
    }))
  };
}

export function faqFromPairs(pairs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };
}

export function servicePageJsonLd({
  serviceName,
  cityName,
  productName,
  description,
  urlPath,
  priceFrom,
  priceTo,
  image,
  includeSiteRating = true,
  reviewStats,
  additionalBadges = []
}) {
  const url = `${SITE_URL}${urlPath}`;
  const low = priceFrom ?? CITY_CAB_PRICE_RANGE.low;
  const high = priceTo ?? Math.round((priceFrom ?? CITY_CAB_PRICE_RANGE.low) * 3.5);
  const stats = reviewStats;
  const extraProps = badgesToSchemaProperties(additionalBadges);
  const hasRealRating = includeSiteRating && stats && Number(stats.reviewCount) > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName || `${serviceName} in ${cityName}`,
    description,
    url,
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: `${serviceName} · Taxi Booking`,
    ...(hasRealRating
      ? {
          aggregateRating: siteAggregateRating({
            ratingValue: stats.ratingValue,
            reviewCount: stats.reviewCount
          })
        }
      : {}),
    ...(extraProps.length ? { additionalProperty: extraProps } : {}),
    offers: buildOffers({
      url,
      price: priceFrom,
      lowPrice: low,
      highPrice: high,
      offerCount: 12
    })
  };
}

export function aggregateReviewJsonLd({ ratingValue, reviewCount, itemName }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1"
    }
  };
}

export function reviewJsonLd({ author, rating, text, datePublished }) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: author },
    reviewRating: { "@type": "Rating", ratingValue: String(rating), bestRating: "5" },
    reviewBody: text,
    datePublished
  };
}

export function routeServiceJsonLd({
  fromCity,
  toCity,
  productName,
  urlPath,
  description,
  priceFrom,
  priceTo,
  image,
  includeSiteRating = true,
  reviewStats = null
}) {
  const url = `${SITE_URL}${urlPath}`;
  const stats = reviewStats;
  const hasRealRating = includeSiteRating && stats && Number(stats.reviewCount) > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName || `One Way Cab ${fromCity.name} to ${toCity.name}`,
    description,
    url,
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "One Way Cab · Outstation",
    ...(hasRealRating
      ? {
          aggregateRating: siteAggregateRating({
            ratingValue: stats.ratingValue,
            reviewCount: stats.reviewCount
          })
        }
      : {}),
    offers: buildOffers({
      url,
      price: priceFrom,
      lowPrice: priceFrom,
      highPrice: priceTo ?? (priceFrom != null ? Math.round(Number(priceFrom) * 1.8) : undefined),
      offerCount: 8
    })
  };
}

export function organizationJsonLd(reviewStats) {
  const sameAs = [...SOCIAL_PROFILES];
  if (WIKIDATA_URL) sameAs.push(WIKIDATA_URL);
  const stats = reviewStats;
  const hasRealRating = stats && Number(stats.reviewCount) > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: "Cabzii",
    alternateName: ["cabzii.in", "Cabzii Cabs", "Cabzii Travels"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO,
      width: 512,
      height: 512
    },
    image: SITE_LOGO,
    description:
      "Book cabs, taxis, airport transfers, outstation trips, acting drivers and tour packages across India with instant confirmation on Cabzii.in.",
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    foundingDate: "2024",
    areaServed: { "@type": "Country", name: "India" },
    ...(hasRealRating
      ? {
          aggregateRating: siteAggregateRating({
            ratingValue: stats.ratingValue,
            reviewCount: stats.reviewCount
          })
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      ...ORG_ADDRESS
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(KNOWLEDGE_GRAPH_ID
      ? { identifier: { "@type": "PropertyValue", propertyID: "googleKnowledgeGraph", value: KNOWLEDGE_GRAPH_ID } }
      : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: ORG_PHONE,
        email: ORG_EMAIL,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Tamil", "Kannada", "Telugu"]
      }
    ]
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: [
      "Cab Booking Chennai | Airport Taxi, Local & Outstation Cabs | Cabzii",
      "cabzii.in"
    ],
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    hasPart: SITE_SITELINKS.map((link) => ({
      "@type": "WebPage",
      name: link.name,
      url: `${SITE_URL}${link.path}`
    }))
  };
}

/** Author/Person markup — helps AI answer engines attribute content. */
export function personJsonLd({ name, url, sameAs, jobTitle }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name || SITE_NAME,
    ...(jobTitle ? { jobTitle } : {}),
    ...(url ? { url } : {}),
    ...(sameAs?.length ? { sameAs } : {}),
    worksFor: { "@id": ORG_ID }
  };
}

export function taxiServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Taxi and Cab Booking",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "India" },
    description:
      "Online cab, taxi, airport transfer, outstation, acting driver and tour package booking across South India."
  };
}

export function faqJsonLd() {
  return faqFromPairs(HOME_PAGE_FAQS);
}

export function localBusinessJsonLd(cityName, cityRegion, urlPath, geo) {
  const url = urlPath ? `${SITE_URL}${urlPath}` : SITE_URL;
  const sameAs = [...SOCIAL_PROFILES];
  const isHqCity = /^chennai$/i.test(String(cityName || "").trim());

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    name: `${SITE_NAME} — ${cityName}`,
    url,
    image: DEFAULT_OG_IMAGE,
    logo: SITE_LOGO,
    telephone: ORG_PHONE,
    email: ORG_EMAIL,
    description: `Book cabs, airport taxi, outstation trips and acting drivers in ${cityName} with instant confirmation on Cabzii.in.`,
    areaServed: {
      "@type": "City",
      name: cityName,
      ...(cityRegion ? { containedInPlace: { "@type": "State", name: cityRegion } } : {})
    },
    priceRange: "₹₹",
    parentOrganization: { "@id": ORG_ID },
    ...(sameAs.length ? { sameAs } : {}),
    ...(geo?.lat && geo?.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: String(geo.lat),
            longitude: String(geo.lng)
          }
        }
      : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59"
      }
    ],
    /* Postal address only for HQ city — do not invent Chennai NAP for every city page */
    ...(isHqCity
      ? {
          address: {
            "@type": "PostalAddress",
            ...ORG_ADDRESS
          }
        }
      : {})
  };
}

/** Rich Product schema for "cab in Chennai" / city cab searches (price range + rating in SERP). */
export function cityCabSearchJsonLd(city, { productName, description, urlPath, priceLow, priceHigh, image, reviewStats }) {
  const url = `${SITE_URL}${urlPath}`;
  const low = priceLow ?? CITY_CAB_PRICE_RANGE.low;
  const high = priceHigh ?? CITY_CAB_PRICE_RANGE.high;
  const stats = reviewStats;
  const hasRealRating = stats && Number(stats.reviewCount) > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName || `Cab Booking in ${city.name}`,
    description:
      description ||
      `Book Maruti Dzire, Ertiga, Innova & Tempo cabs in ${city.name}, ${city.state}. Outstation, airport & local packages.`,
    url,
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Taxi & Cab Booking",
    ...(hasRealRating
      ? {
          aggregateRating: siteAggregateRating({
            ratingValue: stats.ratingValue,
            reviewCount: stats.reviewCount
          })
        }
      : {}),
    offers: buildOffers({ url, lowPrice: low, highPrice: high, offerCount: 24 })
  };
}

/** Rich Product schema for "acting driver in Tirupati" style searches. */
export function cityDriverSearchJsonLd(city, { productName, description, urlPath, priceLow, priceHigh, image }) {
  const url = `${SITE_URL}${urlPath}`;
  const low = priceLow ?? CITY_DRIVER_PRICE_RANGE.low;
  const high = priceHigh ?? CITY_DRIVER_PRICE_RANGE.high;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName || `Acting Driver in ${city.name}`,
    description:
      description ||
      `Hire verified acting drivers & chauffeurs in ${city.name}, ${city.state}. Hourly, daily & outstation packages on your car.`,
    url,
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Chauffeur & Driver Service",
    offers: buildOffers({ url, lowPrice: low, highPrice: high, offerCount: 16 })
  };
}

export function articleJsonLd({ title, description, urlPath, author, datePublished, image }) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const authorName = author && !/^cabzii$/i.test(String(author).trim()) ? author : "Cabzii Team";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: authorName,
      worksFor: { "@id": ORG_ID }
    },
    publisher: {
      "@id": ORG_ID,
      logo: { "@type": "ImageObject", url: SITE_LOGO }
    },
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteImageUrl(image),
            width: 1200,
            height: 630
          }
        }
      : {})
  };
}

/** Browse /cabs catalog — rich snippet for generic cab searches. */
export function cabsCatalogJsonLd() {
  const url = `${SITE_URL}/cabs`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Book Cabs & Taxis Online — Dzire Tour S, Wagon R, Bolero, Innova",
    description:
      "Book Swift Dzire Tour S, Wagon R, Bolero, Ertiga, Toyota Innova Crysta and Tempo Traveller. Cab booking, car rental and taxi hire with published fares on cabzii.in.",
    url,
    image: DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Taxi & Cab Booking",
    offers: buildOffers({ url, lowPrice: CITY_CAB_PRICE_RANGE.low, highPrice: CITY_CAB_PRICE_RANGE.high, offerCount: 40 })
  };
}

/** Browse /drivers catalog — rich snippet for acting driver searches. */
export function driversCatalogJsonLd() {
  const url = `${SITE_URL}/call-driver`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Call Driver in Chennai | Acting Driver Service",
    description:
      "Book a professional call driver or acting driver for your own car in Chennai — local, outstation, airport, monthly, corporate and valet parking.",
    url,
    image: DEFAULT_OG_IMAGE,
    provider: { "@type": "Organization", name: SITE_NAME },
    areaServed: "Chennai",
    offers: buildOffers({
      url,
      lowPrice: CITY_DRIVER_PRICE_RANGE.low,
      highPrice: CITY_DRIVER_PRICE_RANGE.high,
      offerCount: 6
    })
  };
}

export function productJsonLd({
  name,
  description,
  urlPath,
  image,
  price,
  lowPrice,
  highPrice,
  currency = "INR",
  sku,
  ratingValue,
  reviewCount,
  category = "Taxi & Cab Booking",
  additionalBadges = []
}) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const hasRealRating = Number(ratingValue) > 0 && Number(reviewCount) > 0;
  const extraProps = badgesToSchemaProperties(additionalBadges);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    sku: sku || urlPath.replace(/\//g, "-").replace(/^-/, ""),
    category,
    brand: { "@type": "Brand", name: SITE_NAME },
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    ...(hasRealRating
      ? {
          aggregateRating: siteAggregateRating({
            ratingValue: String(ratingValue),
            reviewCount: String(reviewCount)
          })
        }
      : {}),
    ...(extraProps.length ? { additionalProperty: extraProps } : {}),
    offers: buildOffers({
      url,
      price,
      ...(lowPrice != null && highPrice != null && Number(lowPrice) !== Number(highPrice)
        ? { lowPrice, highPrice }
        : {})
    })
  };
}

/** Tour / holiday package — rich results with duration & inclusions. */
export function tourPackageJsonLd({
  name,
  description,
  urlPath,
  image,
  price,
  lowPrice,
  highPrice,
  additionalBadges = [],
  originCity
}) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const extraProps = badgesToSchemaProperties(additionalBadges);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    image: absoluteImageUrl(image) || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Holiday Tour Package",
    ...(originCity
      ? {
          areaServed: { "@type": "City", name: originCity }
        }
      : {}),
    ...(extraProps.length ? { additionalProperty: extraProps } : {}),
    offers: buildOffers({
      url,
      price,
      ...(lowPrice != null && highPrice != null ? { lowPrice, highPrice } : {})
    })
  };
}

/** Generic WebPage / AboutPage / legal pages. */
export function webPageJsonLd({ name, description, urlPath, type = "WebPage" }) {
  const path = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN"
  };
}

export function aboutPageJsonLd() {
  return webPageJsonLd({
    type: "AboutPage",
    name: "About Cabzii",
    description:
      "Cabzii is a cab and taxi booking platform for airport transfers, outstation trips, local rentals and acting drivers across South India.",
    urlPath: "/about"
  });
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Cabzii",
    url: `${SITE_URL}/contact`,
    description: "24×7 phone, WhatsApp and email support for cab booking on Cabzii.in.",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      telephone: ORG_PHONE,
      email: ORG_EMAIL,
      url: SITE_URL
    }
  };
}

/** Blog index — ItemList of posts for crawl & AI overview. */
export function blogListingJsonLd(posts = []) {
  const list = (posts || []).filter((p) => p?.slug).slice(0, 48);
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Cabzii Travel Blog",
    url: `${SITE_URL}/blogs`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    blogPost: list.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
      ...(post.publishedAt ? { datePublished: post.publishedAt } : {})
    }))
  };
}

/** Service cities hub — links to /cab-booking/{city}. */
export function locationsIndexJsonLd(cities) {
  const list = cities || [];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cabzii cab booking cities",
    url: `${SITE_URL}/locations`,
    numberOfItems: list.length,
    itemListElement: list.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Cab booking ${city.name}`,
      url: `${SITE_URL}/cab-booking/${city.slug}`
    }))
  };
}

export function legalWebPageJsonLd({ name, description, urlPath }) {
  return webPageJsonLd({ name, description, urlPath, type: "WebPage" });
}
