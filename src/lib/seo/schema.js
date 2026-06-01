import { HOME_PAGE_FAQS } from "./content";
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
  SITE_REVIEW_STATS,
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
  return {
    "@type": "AggregateRating",
    ratingValue: overrides.ratingValue ?? SITE_REVIEW_STATS.ratingValue,
    reviewCount: overrides.reviewCount ?? SITE_REVIEW_STATS.reviewCount,
    bestRating: overrides.bestRating ?? SITE_REVIEW_STATS.bestRating,
    worstRating: overrides.worstRating ?? SITE_REVIEW_STATS.worstRating
  };
}

function buildOffers({ url, price, lowPrice, highPrice, offerCount }) {
  const base = {
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
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

export function servicePageJsonLd({ serviceName, cityName, description, urlPath, priceFrom, priceTo, image }) {
  const url = `${SITE_URL}${urlPath}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceName} in ${cityName}`,
    description,
    url,
    image: image || DEFAULT_OG_IMAGE,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "City", name: cityName },
    aggregateRating: siteAggregateRating(),
    ...(priceFrom != null && {
      offers: buildOffers({
        url,
        price: priceFrom,
        lowPrice: priceFrom,
        highPrice: priceTo ?? Math.round(priceFrom * 4)
      })
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

export function routeServiceJsonLd({ fromCity, toCity, urlPath, description, priceFrom, priceTo, image }) {
  const url = `${SITE_URL}${urlPath}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `One Way Cab ${fromCity.name} to ${toCity.name}`,
    description,
    url,
    image: image || DEFAULT_OG_IMAGE,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "City", name: fromCity.name },
      { "@type": "City", name: toCity.name }
    ],
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({
      url,
      price: priceFrom,
      lowPrice: priceFrom,
      highPrice: priceTo ?? Math.round((priceFrom || 1400) * 1.8)
    })
  };
}

export function organizationJsonLd() {
  const sameAs = [...SOCIAL_PROFILES];
  if (WIKIDATA_URL) sameAs.push(WIKIDATA_URL);

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
      width: 1200,
      height: 630
    },
    image: SITE_LOGO,
    description:
      "Online cab, taxi, airport transfer, outstation, acting driver and tour package booking platform across South India.",
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    foundingDate: "2024",
    areaServed: { "@type": "Country", name: "India" },
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
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
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

export function localBusinessJsonLd(cityName, cityRegion, urlPath) {
  const url = urlPath ? `${SITE_URL}${urlPath}` : SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} — ${cityName}`,
    url,
    image: DEFAULT_OG_IMAGE,
    telephone: ORG_PHONE,
    description: `Cab, taxi, airport transfer and acting driver booking in ${cityName} via ${SITE_NAME}.`,
    areaServed: cityName,
    priceRange: "₹₹",
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({
      url,
      lowPrice: CITY_CAB_PRICE_RANGE.low,
      highPrice: CITY_CAB_PRICE_RANGE.high,
      offerCount: 20
    }),
    ...(cityRegion ? { address: { "@type": "PostalAddress", addressRegion: cityRegion, addressCountry: "IN" } } : {})
  };
}

/** Rich Product schema for "cab in Chennai" / city cab searches (price range + rating in SERP). */
export function cityCabSearchJsonLd(city, { description, urlPath, priceLow, priceHigh, image }) {
  const url = `${SITE_URL}${urlPath}`;
  const low = priceLow ?? CITY_CAB_PRICE_RANGE.low;
  const high = priceHigh ?? CITY_CAB_PRICE_RANGE.high;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Cab Booking in ${city.name}`,
    description:
      description ||
      `Book Maruti Dzire, Ertiga, Innova & Tempo cabs in ${city.name}, ${city.state}. Outstation, airport & local packages.`,
    url,
    image: image || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Taxi & Cab Booking",
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({ url, lowPrice: low, highPrice: high, offerCount: 24 })
  };
}

/** Rich Product schema for "acting driver in Tirupati" style searches. */
export function cityDriverSearchJsonLd(city, { description, urlPath, priceLow, priceHigh, image }) {
  const url = `${SITE_URL}${urlPath}`;
  const low = priceLow ?? CITY_DRIVER_PRICE_RANGE.low;
  const high = priceHigh ?? CITY_DRIVER_PRICE_RANGE.high;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Acting Driver in ${city.name}`,
    description:
      description ||
      `Hire verified acting drivers & chauffeurs in ${city.name}, ${city.state}. Hourly, daily & outstation packages on your car.`,
    url,
    image: image || DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Chauffeur & Driver Service",
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({ url, lowPrice: low, highPrice: high, offerCount: 16 })
  };
}

export function articleJsonLd({ title, description, urlPath, author, datePublished, image }) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: author || SITE_NAME, worksFor: { "@id": ORG_ID } },
    publisher: { "@id": ORG_ID },
    ...(datePublished ? { datePublished } : {}),
    ...(image ? { image } : {})
  };
}

/** Browse /cabs catalog — rich snippet for generic cab searches. */
export function cabsCatalogJsonLd() {
  const url = `${SITE_URL}/cabs`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Book Cabs & Taxis Online — Dzire, Ertiga, Innova, Tempo",
    description:
      "Book Maruti Dzire, Ertiga, Toyota Innova Crysta and Tempo Traveller with transparent fares. Outstation, airport and local packages on cabzii.in.",
    url,
    image: DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Taxi & Cab Booking",
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({ url, lowPrice: CITY_CAB_PRICE_RANGE.low, highPrice: CITY_CAB_PRICE_RANGE.high, offerCount: 40 })
  };
}

/** Browse /drivers catalog — rich snippet for acting driver searches. */
export function driversCatalogJsonLd() {
  const url = `${SITE_URL}/drivers`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Hire Acting Drivers & Chauffeurs Online",
    description:
      "Verified acting drivers for Dzire, Ertiga, Innova & Tempo. Hourly, daily and outstation chauffeur packages on cabzii.in.",
    url,
    image: DEFAULT_OG_IMAGE,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Chauffeur & Driver Service",
    aggregateRating: siteAggregateRating(),
    offers: buildOffers({
      url,
      lowPrice: CITY_DRIVER_PRICE_RANGE.low,
      highPrice: CITY_DRIVER_PRICE_RANGE.high,
      offerCount: 24
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
  category = "Taxi & Cab Booking"
}) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const rating =
    ratingValue != null
      ? siteAggregateRating({
          ratingValue: String(ratingValue),
          reviewCount: reviewCount != null ? String(reviewCount) : SITE_REVIEW_STATS.reviewCount
        })
      : siteAggregateRating();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    sku: sku || urlPath.replace(/\//g, "-").replace(/^-/, ""),
    category,
    brand: { "@type": "Brand", name: SITE_NAME },
    image: image || DEFAULT_OG_IMAGE,
    aggregateRating: rating,
    offers: buildOffers({
      url,
      price,
      ...(lowPrice != null && highPrice != null && Number(lowPrice) !== Number(highPrice)
        ? { lowPrice, highPrice }
        : {})
    })
  };
}
