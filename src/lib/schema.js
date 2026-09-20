/**
 * Typed JSON-LD helper for city taxi landing pages.
 * Values must match visible copy from `buildCityCabData`.
 *
 * @typedef {{ name: string, fareFrom: number }} CityCabOfferInput
 * @typedef {{ question: string, answer: string }} CityCabFaq
 * @typedef {{
 *   cityName: string,
 *   pageUrl: string,
 *   path: string,
 *   telephone: string,
 *   priceRange: string,
 *   cabTypes: CityCabOfferInput[],
 *   faqs: CityCabFaq[],
 *   siteUrl: string,
 *   siteName: string,
 *   logoUrl: string,
 *   sameAs: string[],
 *   description: string,
 *   reviewStats?: { ratingValue: string, reviewCount: string } | null
 * }} CityCabSchemaInput
 */

import { ORG_ID, WEBSITE_ID, siteAggregateRating } from "./seo/schema";
import { SITE_URL, SITE_NAME, SITE_LOGO, SOCIAL_PROFILES, ORG_PHONE } from "./seo/constants";

function taxiOffers(cabTypes) {
  return (cabTypes || []).map((cab) => ({
    "@type": "Offer",
    priceCurrency: "INR",
    price: String(cab.fareFrom),
    itemOffered: {
      "@type": "Service",
      name: cab.name
    }
  }));
}

function faqEntities(faqs) {
  return (faqs || []).map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }));
}

/**
 * @param {CityCabSchemaInput} input
 */
export function buildCityCabJsonLd(input) {
  const siteUrl = input.siteUrl || SITE_URL;
  const siteName = input.siteName || SITE_NAME;
  const pageUrl = input.pageUrl;
  const serviceId = `${pageUrl}#service`;
  const rating = siteAggregateRating(input.reviewStats || {});

  const taxiService = {
    "@type": "TaxiService",
    "@id": serviceId,
    name: `${siteName} Taxi Service in ${input.cityName}`,
    url: pageUrl,
    areaServed: { "@type": "City", name: input.cityName },
    priceRange: input.priceRange || "₹₹",
    telephone: input.telephone || ORG_PHONE,
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${input.cityName} cab types`,
      itemListElement: taxiOffers(input.cabTypes)
    }
  };
  if (rating) taxiService.aggregateRating = rating;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Car Rental", item: `${siteUrl}/car-rental` },
      { "@type": "ListItem", position: 3, name: `${input.cityName} Cabs`, item: pageUrl }
    ]
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqEntities(input.faqs)
  };

  const organization = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteName,
    url: siteUrl,
    logo: input.logoUrl || SITE_LOGO,
    telephone: input.telephone || ORG_PHONE,
    sameAs: input.sameAs?.length ? input.sameAs : SOCIAL_PROFILES
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${siteName} Taxi Service in ${input.cityName}`,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID, "@type": "WebSite", name: siteName, url: siteUrl },
    about: { "@id": serviceId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return {
    "@context": "https://schema.org",
    "@graph": [taxiService, breadcrumb, faqPage, webPage, organization]
  };
}

/**
 * JSON-LD for /call-drivers-chennai. Values must match CALL_DRIVERS_CHENNAI visible copy.
 * @param {{
 *   pageUrl: string,
 *   name: string,
 *   description: string,
 *   telephone: string[],
 *   email: string,
 *   sameAs: string[],
 *   logoUrl: string,
 *   address: { streetAddress: string, addressLocality: string, addressRegion: string, postalCode: string, addressCountry: string },
 *   offers: { name: string, price?: number }[],
 *   faqs: { question: string, answer: string }[]
 * }} input
 */
export function buildCallDriversChennaiJsonLd(input) {
  const siteUrl = SITE_URL;
  const pageUrl = input.pageUrl;
  const orgId = `${siteUrl}/#org`;
  const serviceId = `${pageUrl}#service`;
  const webPageId = `${pageUrl}#webpage`;

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": orgId,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: input.logoUrl || SITE_LOGO,
    telephone: input.telephone,
    email: input.email,
    openingHours: "Mo-Su 00:00-23:59",
    address: {
      "@type": "PostalAddress",
      ...input.address
    },
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {})
  };

  const itemListElement = (input.offers || []).map((offer) => {
    const node = {
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: offer.name }
    };
    if (offer.price != null && Number(offer.price) > 0) {
      node.priceCurrency = "INR";
      node.price = String(offer.price);
    }
    return node;
  });

  const service = {
    "@type": "Service",
    "@id": serviceId,
    name: "Acting Drivers in Chennai",
    serviceType: "Acting driver service",
    provider: { "@id": orgId },
    areaServed: { "@type": "City", name: "Chennai" },
    url: pageUrl,
    description: input.description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Acting driver services",
      itemListElement
    }
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Driver Services", item: `${siteUrl}/call-driver` },
      { "@type": "ListItem", position: 3, name: "Acting Drivers in Chennai", item: pageUrl }
    ]
  };

  const webPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url: pageUrl,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID, "@type": "WebSite", name: SITE_NAME, url: siteUrl },
    about: { "@id": serviceId },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
  };
  breadcrumb["@id"] = `${pageUrl}#breadcrumb`;

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: (input.faqs || []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };

  return {
    "@context": "https://schema.org",
    "@graph": [localBusiness, service, webPage, breadcrumb, faqPage]
  };
}
