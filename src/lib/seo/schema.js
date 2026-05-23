import { SITE_URL, SITE_NAME } from "./constants";

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
      availableLanguage: ["English", "Hindi", "Tamil", "Kannada", "Telugu"]
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

export function productJsonLd({ name, description, urlPath, image, price, currency = "INR" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`,
    ...(image ? { image } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: price != null ? String(price) : undefined,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`
    }
  };
}
