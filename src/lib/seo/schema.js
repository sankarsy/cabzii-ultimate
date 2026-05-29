import {
  SITE_URL,
  SITE_NAME,
  SITE_LOGO,
  ORG_EMAIL,
  ORG_PHONE,
  ORG_ADDRESS,
  SOCIAL_PROFILES,
  WIKIDATA_URL,
  KNOWLEDGE_GRAPH_ID
} from "./constants";

/** Stable @id for the Organization entity, referenced by other schema nodes. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

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

export function servicePageJsonLd({ serviceName, cityName, description, urlPath, priceFrom }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceName} in ${cityName}`,
    description,
    url: `${SITE_URL}${urlPath}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "City", name: cityName },
    ...(priceFrom != null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: String(priceFrom),
        availability: "https://schema.org/InStock"
      }
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

export function routeServiceJsonLd({ fromCity, toCity, urlPath, description, priceFrom }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `One Way Cab ${fromCity.name} to ${toCity.name}`,
    description,
    url: `${SITE_URL}${urlPath}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: [
      { "@type": "City", name: fromCity.name },
      { "@type": "City", name: toCity.name }
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(priceFrom),
      availability: "https://schema.org/InStock"
    }
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
  return faqFromPairs([
    [
      "How do I book a cab on Cabzii?",
      "Enter pickup and destination on cabzii.in, choose a cab or service, login with mobile OTP, and confirm payment."
    ],
    [
      "Do I need an account to book?",
      "Yes. Login with your 10-digit mobile number and a one-time OTP to complete a booking."
    ],
    [
      "Can I hire an acting driver?",
      "Yes. Cabzii offers professional acting drivers and chauffeurs for local and outstation trips with transparent package fares."
    ],
    [
      "Does Cabzii serve South Indian cities?",
      "Yes. Cabzii covers Chennai, Bengaluru, Hyderabad, Coimbatore, Madurai, Trichy, Mysore, Pondicherry, Tirupati and more."
    ]
  ]);
}

export function localBusinessJsonLd(cityName, cityRegion) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} — ${cityName}`,
    url: SITE_URL,
    description: `Cab, taxi, airport transfer and acting driver booking in ${cityName} via ${SITE_NAME}.`,
    areaServed: cityName,
    priceRange: "₹₹",
    ...(cityRegion ? { address: { "@type": "PostalAddress", addressRegion: cityRegion, addressCountry: "IN" } } : {})
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

export function productJsonLd({ name, description, urlPath, image, price, currency = "INR" }) {
  const url = `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(image ? { image } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      ...(price != null ? { price: String(price) } : {}),
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": ORG_ID }
    }
  };
}
