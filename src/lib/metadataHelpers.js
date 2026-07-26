import { catalogPublicPath } from "./catalogProduct";
import { resolveMediaUrl } from "./media";
import { absoluteImageUrl, PRODUCT_OG_HEIGHT, PRODUCT_OG_WIDTH } from "./imageOptimize";
import { buildPageMetadata, productJsonLd, tourPackageJsonLd } from "./seo";
import { clampDescription } from "./seo/programmaticMeta";
import { serpPriceLine, tourPackageSerpBadges, vehicleSerpBadges } from "./seo/serpRichData";
import { buildVehicleJsonLd, robotsIsNoindex, withPublicEnterpriseSeo } from "./vehicleEnterpriseSeo";

function applyEnterpriseMetaOverrides(metadata, item, { pathPrefix = "/cabs" } = {}) {
  if (!metadata || !item) return metadata;
  const es = item.enterpriseSeo && typeof item.enterpriseSeo === "object" ? item.enterpriseSeo : {};
  const ogTitle = es.ogTitle || item.seoTitle || metadata.openGraph?.title;
  const ogDescription = es.ogDescription || item.seoDescription || metadata.openGraph?.description;
  const ogImage = absoluteImageUrl(resolveMediaUrl(es.ogImage)) || metadata.openGraph?.images?.[0]?.url;
  const twitterTitle = es.twitterTitle || ogTitle;
  const twitterDescription = es.twitterDescription || ogDescription;
  const twitterImage = absoluteImageUrl(resolveMediaUrl(es.twitterImage || es.ogImage)) || metadata.twitter?.images?.[0];

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
      ? { images: [{ url: ogImage, alt: item.imageAlt || ogTitle, width: PRODUCT_OG_WIDTH, height: PRODUCT_OG_HEIGHT }] }
      : {})
  };
  metadata.twitter = {
    ...(metadata.twitter || {}),
    title: twitterTitle,
    description: twitterDescription,
    ...(twitterImage ? { images: [twitterImage] } : {})
  };
  // pathPrefix reserved for future absolute OG URL helpers
  void pathPrefix;
  return metadata;
}

function tourPackageSeoPath(pkg) {
  const slug = pkg?.slug ? String(pkg.slug).trim() : "";
  return slug ? `/tour-packages/${slug}` : null;
}

function detailPath(item, basePath, fallbackId) {
  if (item?.slug) return catalogPublicPath(item, basePath);
  const key = fallbackId || item?._id || item?.id;
  return key ? `${basePath}/${key}` : basePath;
}

function tourPackageMetaFields(pkg, slug) {
  const origin = pkg?.pricingOriginCity || pkg?.city || "Chennai";
  const durationLabel =
    pkg?.days > 0
      ? `${pkg.days} Day${pkg.days > 1 ? "s" : ""}${pkg.nights > 0 ? ` / ${pkg.nights} Night${pkg.nights > 1 ? "s" : ""}` : ""}`
      : pkg?.duration || "";
  const title =
    pkg?.seoTitle ||
    `${pkg.name}${durationLabel ? ` — ${durationLabel}` : ""} | Book from ₹${Number(pkg?.price || 0).toLocaleString("en-IN")}`;
  const priceLine = serpPriceLine(pkg?.price);
  const description =
    pkg?.seoDescription ||
    pkg?.description?.slice(0, 158) ||
    clampDescription(
      `${priceLine}Book ${pkg.name} with ${pkg.vendor} on Cabzii.in — verified cabs, transparent pricing & instant confirmation.`
    );
  const keywords = (pkg?.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(pkg?.image);
  const absoluteImage = absoluteImageUrl(image);
  const path = `/tour-packages/${pkg?.slug || slug}`;

  return { origin, title, description, keywords, absoluteImage, path };
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
  const title =
    enriched.seoTitle ||
    (enriched.city ? `${enriched.title} Rental in ${enriched.city} | Best Price | Cabzii` : `${enriched.title} Rental | Best Price | Cabzii`);
  const priceLine = serpPriceLine(enriched.price);
  const description =
    enriched.seoDescription ||
    enriched.shortDescription ||
    clampDescription(
      `${priceLine}Book ${enriched.title} — ${enriched.type || "AC cab"} with driver included, sanitized car, local 4hr/8hr & outstation packages on Cabzii.in.`
    );
  const keywords = (enriched.metaKeywords || enriched.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(enriched.ogImage || enriched.image);
  const absoluteImage = absoluteImageUrl(image);
  const path = detailPath(enriched, "/cabs", id);
  const noindex = robotsIsNoindex(enriched.robots);

  const metadata = applyEnterpriseMetaOverrides(
    buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image: absoluteImage || undefined,
      imageAlt: enriched.imageAlt || enriched.imageTitle || enriched.title,
      imageWidth: PRODUCT_OG_WIDTH,
      imageHeight: PRODUCT_OG_HEIGHT,
      type: "website",
      noindex
    }),
    enriched,
    { pathPrefix: "/cabs" }
  );

  const jsonLd =
    enriched.schemaEnabled === false
      ? null
      : buildVehicleJsonLd(
          {
            ...enriched,
            seoTitle: title,
            seoDescription: description
          },
          "/cabs"
        ) ||
        productJsonLd({
          name: enriched.title,
          description,
          urlPath: path,
          image: absoluteImage || undefined,
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
  const image = resolveMediaUrl(enriched.ogImage || enriched.image);
  const absoluteImage = absoluteImageUrl(image);
  const path = detailPath(enriched, "/drivers", id);
  const noindex = robotsIsNoindex(enriched.robots);

  const metadata = applyEnterpriseMetaOverrides(
    buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image: absoluteImage || undefined,
      imageAlt: enriched.imageAlt || enriched.imageTitle || enriched.name,
      imageWidth: PRODUCT_OG_WIDTH,
      imageHeight: PRODUCT_OG_HEIGHT,
      noindex
    }),
    enriched,
    { pathPrefix: "/drivers" }
  );

  return {
    metadata,
    jsonLd: productJsonLd({
      name: `${enriched.name} — Acting Driver`,
      description,
      urlPath: path,
      image: absoluteImage || undefined,
      price: enriched.pricing?.day || enriched.pricing?.hourly,
      lowPrice: enriched.pricing?.hourly,
      highPrice: enriched.pricing?.day,
      ratingValue: enriched.rating,
      reviewCount: enriched.reviewCount,
      category: "Acting Driver & Chauffeur Service"
    })
  };
}

/** SEO landing page at /tour-packages/{slug} — indexable canonical URL. */
export function tourPackageLandingMetadata(pkg, slug) {
  if (!pkg) {
    return {
      metadata: buildPageMetadata({
        title: "Tour Package Not Found",
        description: "This tour package is not available on cabzii.in.",
        path: `/tour-packages/${slug}`,
        noindex: true
      }),
      jsonLd: null
    };
  }

  const enriched = withPublicEnterpriseSeo(pkg);
  const { origin, title, description, keywords, absoluteImage, path } = tourPackageMetaFields(enriched, slug);
  const noindex = robotsIsNoindex(enriched.robots);
  const metadata = applyEnterpriseMetaOverrides(
    buildPageMetadata({
      title,
      description: enriched.shortDescription || description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image: absoluteImageUrl(resolveMediaUrl(enriched.ogImage)) || absoluteImage || undefined,
      imageAlt: enriched.imageAlt || enriched.imageTitle || enriched.name,
      imageWidth: PRODUCT_OG_WIDTH,
      imageHeight: PRODUCT_OG_HEIGHT,
      noindex
    }),
    enriched,
    { pathPrefix: "/tour-packages" }
  );

  return {
    metadata,
    jsonLd: tourPackageJsonLd({
      name: enriched.name,
      description: enriched.shortDescription || description,
      urlPath: path,
      image: absoluteImageUrl(resolveMediaUrl(enriched.ogImage)) || absoluteImage || undefined,
      price: enriched.price,
      originCity: origin,
      ...(enriched.originalPrice && Number(enriched.originalPrice) > Number(enriched.price)
        ? { lowPrice: enriched.price, highPrice: enriched.originalPrice }
        : {}),
      additionalBadges: tourPackageSerpBadges(enriched)
    })
  };
}

/** Booking page at /holidays/{id} — noindex when SEO landing exists. */
export function packageDetailMetadata(pkg, id) {
  if (!pkg) {
    return {
      metadata: buildPageMetadata({
        title: "Holiday Package Not Found",
        description: "This holiday package is not available on Cabzii.",
        path: `/holidays/${id}`,
        noindex: true
      }),
      jsonLd: null
    };
  }

  const origin = pkg.pricingOriginCity || pkg.city || "Chennai";
  const title = pkg.seoTitle || `${pkg.name} Tour Package from ${origin} | Cabzii`;
  const priceLine = serpPriceLine(pkg.price);
  const description =
    pkg.seoDescription ||
    clampDescription(
      `${priceLine}Book ${pkg.name} with ${pkg.vendor} on Cabzii.in — hotel, sightseeing, meals & customizable itinerary. Instant confirmation.`
    );
  const keywords = (pkg.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(pkg.image);
  const absoluteImage = absoluteImageUrl(image);
  const catalogPath = detailPath(pkg, "/holidays", id);
  const seoLandingPath = tourPackageSeoPath(pkg);
  const canonicalPath = seoLandingPath || catalogPath;

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path: canonicalPath,
      keywords: keywords.length ? keywords : undefined,
      image: absoluteImage || undefined,
      imageAlt: pkg.imageAlt || pkg.imageTitle || pkg.name,
      imageWidth: PRODUCT_OG_WIDTH,
      imageHeight: PRODUCT_OG_HEIGHT,
      noindex: Boolean(seoLandingPath)
    }),
    jsonLd: tourPackageJsonLd({
      name: pkg.name,
      description,
      urlPath: canonicalPath,
      image: absoluteImage || undefined,
      price: pkg.price,
      originCity: origin,
      ...(pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price)
        ? { lowPrice: pkg.price, highPrice: pkg.originalPrice }
        : {}),
      additionalBadges: tourPackageSerpBadges(pkg)
    })
  };
}
