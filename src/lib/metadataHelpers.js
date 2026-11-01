import { catalogPublicPath } from "./catalogProduct";
import { resolveProductImageSeo } from "./dynamicImageSeo";
import { buildPageMetadata, productJsonLd } from "./seo";
import { clampDescription } from "./seo/programmaticMeta";
import { serpPriceLine, vehicleSerpBadges } from "./seo/serpRichData";
import { buildVehicleJsonLd, normalizeSeoCity, robotsIsNoindex, withPublicEnterpriseSeo } from "./vehicleEnterpriseSeo";

function applyEnterpriseMetaOverrides(metadata, item, { pathPrefix = "/cabs", imageSeo = null } = {}) {
  if (!metadata || !item) return metadata;
  const es = item.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {};
  const seo = imageSeo || resolveProductImageSeo(item);
  const ogTitle = es.ogTitle || item.seoTitle || metadata.openGraph?.title;
  const ogDescription = es.ogDescription || item.seoDescription || metadata.openGraph?.description;
  const ogImage = seo.ogUrl || metadata.openGraph?.images?.[0]?.url;
  const twitterTitle = es.twitterTitle || ogTitle;
  const twitterDescription = es.twitterDescription || ogDescription;
  const twitterImage = seo.twitterUrl || metadata.twitter?.images?.[0];

  if (item.canonicalUrl) {
    metadata.alternates = { ...(metadata.alternates || {}), canonical: item.canonicalUrl };
  }
  if (robotsIsNoindex(es.robots)) {
    metadata.robots = { index: false, follow: !String(es.robots).toLowerCase().includes("nofollow"), googleBot: { index: false, follow: false } };
  } else if (String(es.robots || "").toLowerCase().includes("nofollow")) {
    metadata.robots = { index: true, follow: false, googleBot: { index: true, follow: false } };
  }
  metadata.openGraph = {
    ...(metadata.openGraph || {}),
    title: ogTitle,
    description: ogDescription,
    ...(ogImage
      ? {
          images: [
            {
              url: ogImage,
              alt: seo.alt || item.imageAlt || ogTitle,
              width: seo.width,
              height: seo.height
            }
          ]
        }
      : {})
  };
  metadata.twitter = {
    ...(metadata.twitter || {}),
    title: twitterTitle,
    description: twitterDescription,
    ...(twitterImage ? { images: [twitterImage] } : {})
  };
  void pathPrefix;
  return metadata;
}

function detailPath(item, basePath, fallbackId) {
  if (item?.slug) return catalogPublicPath(item, basePath);
  const key = fallbackId || item?._id || item?.id;
  return key ? `${basePath}/${key}` : basePath;
}

export function cabDetailMetadata(cab, id) {
  if (!cab) {
    return {
      metadata: buildPageMetadata({
        title: "Cab Not Found",
        description: "This cab listing is not available on Cabzii.",
        path: `/cabs/${id}`,
        noindex: true
      }),
      jsonLd: null
    };
  }

  const enriched = withPublicEnterpriseSeo(cab);
  const imageSeo = resolveProductImageSeo(enriched, { kind: "cab" });
  const cityLabel = normalizeSeoCity(enriched.city);
  const rawTitle =
    enriched.seoTitle ||
    `${enriched.title} Rental in ${cityLabel} | Best Price | Cabzii`;
  const title = String(rawTitle).replace(/\bAll India\b/gi, cityLabel);
  const priceLine = serpPriceLine(enriched.price);
  const description = String(
    enriched.seoDescription ||
      enriched.shortDescription ||
      clampDescription(
        `${priceLine}Book ${enriched.title} in ${cityLabel} — ${enriched.type || "AC cab"} with driver included, sanitized car, local 4hr/8hr & outstation packages on Cabzii.in.`
      )
  ).replace(/\bAll India\b/gi, cityLabel);
  const keywords = (enriched.metaKeywords || enriched.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const path = detailPath(enriched, "/cabs", id);
  const unpublished = String(enriched.status || "active") !== "active";
  const noindex = robotsIsNoindex(enriched.robots) || unpublished;

  const metadata = applyEnterpriseMetaOverrides(
    buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image: imageSeo.ogUrl || undefined,
      imageAlt: imageSeo.alt,
      imageWidth: imageSeo.width,
      imageHeight: imageSeo.height,
      type: "website",
      noindex
    }),
    enriched,
    { pathPrefix: "/cabs", imageSeo }
  );

  const jsonLd =
    enriched.schemaEnabled === false
      ? null
      : buildVehicleJsonLd(
          {
            ...enriched,
            seoTitle: title,
            seoDescription: description,
            ogImage: imageSeo.ogUrl,
            image: imageSeo.coverUrl,
            imageAlt: imageSeo.alt
          },
          "/cabs"
        ) ||
        productJsonLd({
          name: enriched.title,
          description,
          urlPath: path,
          image: imageSeo.absoluteUrl || undefined,
          price: enriched.price,
          ...(enriched.originalPrice && Number(enriched.originalPrice) > Number(enriched.price)
            ? { lowPrice: enriched.price, highPrice: enriched.originalPrice }
            : {}),
          ratingValue: enriched.rating,
          reviewCount: enriched.reviewCount,
          category: `${enriched.type || "Cab"} · Taxi Booking`,
          additionalBadges: vehicleSerpBadges(enriched)
        });

  return { metadata, jsonLd };
}

export function driverDetailMetadata(driver, id) {
  if (!driver) {
    return {
      metadata: buildPageMetadata({
        title: "Driver Not Found",
        description: "This driver listing is not available on Cabzii.",
        path: `/drivers/${id}`,
        noindex: true
      }),
      jsonLd: null
    };
  }

  const enriched = withPublicEnterpriseSeo(driver);
  const imageSeo = resolveProductImageSeo(enriched, { kind: "driver" });
  const title =
    enriched.seoTitle ||
    `${enriched.name} Acting Driver | ${enriched.city || "South India"} | Cabzii`;
  const description =
    enriched.seoDescription ||
    enriched.shortDescription ||
    `Professional acting driver for your ${enriched.name} in ${enriched.city || "South India"}. Same package fares as cab booking on cabzii.in.`;
  const keywords = (enriched.metaKeywords || enriched.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const path = detailPath(enriched, "/drivers", id);
  const noindex = robotsIsNoindex(enriched.robots);

  const metadata = applyEnterpriseMetaOverrides(
    buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image: imageSeo.ogUrl || undefined,
      imageAlt: imageSeo.alt,
      imageWidth: imageSeo.width,
      imageHeight: imageSeo.height,
      noindex
    }),
    enriched,
    { pathPrefix: "/drivers", imageSeo }
  );

  return {
    metadata,
    jsonLd: productJsonLd({
      name: `${enriched.name} — Acting Driver`,
      description,
      urlPath: path,
      image: imageSeo.absoluteUrl || undefined,
      price: enriched.pricing?.day || enriched.pricing?.hourly,
      lowPrice: enriched.pricing?.hourly,
      highPrice: enriched.pricing?.day,
      ratingValue: enriched.rating,
      reviewCount: enriched.reviewCount,
      category: "Acting Driver & Chauffeur Service"
    })
  };
}
