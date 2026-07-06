import { catalogPublicPath } from "./catalogProduct";
import { resolveMediaUrl } from "./media";
import { buildPageMetadata, productJsonLd, tourPackageJsonLd } from "./seo";
import { clampDescription } from "./seo/programmaticMeta";
import { serpPriceLine, tourPackageSerpBadges, vehicleSerpBadges } from "./seo/serpRichData";

function tourPackageSeoPath(pkg) {
  const slug = pkg?.slug ? String(pkg.slug).trim() : "";
  return slug ? `/tour-packages/${slug}` : null;
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

  const title =
    cab.seoTitle ||
    (cab.city ? `${cab.title} Rental in ${cab.city} | Best Price | Cabzii` : `${cab.title} Rental | Best Price | Cabzii`);
  const priceLine = serpPriceLine(cab.price);
  const description =
    cab.seoDescription ||
    clampDescription(
      `${priceLine}Book ${cab.title} — ${cab.type || "AC cab"} with driver included, sanitized car, local 4hr/8hr & outstation packages on Cabzii.in.`
    );
  const keywords = (cab.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(cab.image);
  const path = detailPath(cab, "/cabs", id);

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: cab.imageAlt || cab.imageTitle || cab.title
    }),
    jsonLd: productJsonLd({
      name: cab.title,
      description,
      urlPath: path,
      image: image || undefined,
      price: cab.price,
      ...(cab.originalPrice && Number(cab.originalPrice) > Number(cab.price)
        ? { lowPrice: cab.price, highPrice: cab.originalPrice }
        : {}),
      ratingValue: cab.rating,
      reviewCount: cab.reviewCount,
      category: `${cab.type || "Cab"} · Taxi Booking`,
      additionalBadges: vehicleSerpBadges(cab)
    })
  };
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

  const title =
    driver.seoTitle ||
    `${driver.name} Acting Driver | ${driver.city || "South India"} | Cabzii`;
  const description =
    driver.seoDescription ||
    `Professional acting driver for your ${driver.name} in ${driver.city || "South India"}. Same package fares as cab booking on cabzii.in.`;
  const keywords = (driver.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(driver.image);
  const path = detailPath(driver, "/drivers", id);

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: driver.imageAlt || driver.imageTitle || driver.name
    }),
    jsonLd: productJsonLd({
      name: `${driver.name} — Acting Driver`,
      description,
      urlPath: path,
      image: image || undefined,
      price: driver.pricing?.day || driver.pricing?.hourly,
      lowPrice: driver.pricing?.hourly,
      highPrice: driver.pricing?.day,
      ratingValue: driver.rating,
      reviewCount: driver.reviewCount,
      category: "Acting Driver & Chauffeur Service"
    })
  };
}

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

  const origin = pkg.city || pkg.originCity || "Chennai";
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
  const catalogPath = detailPath(pkg, "/holidays", id);
  const seoLandingPath = tourPackageSeoPath(pkg);
  const canonicalPath = seoLandingPath || catalogPath;

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path: canonicalPath,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: pkg.imageAlt || pkg.imageTitle || pkg.name,
      noindex: Boolean(seoLandingPath)
    }),
    jsonLd: tourPackageJsonLd({
      name: pkg.name,
      description,
      urlPath: canonicalPath,
      image: image || undefined,
      price: pkg.price,
      originCity: origin,
      ...(pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price)
        ? { lowPrice: pkg.price, highPrice: pkg.originalPrice }
        : {}),
      additionalBadges: tourPackageSerpBadges(pkg)
    })
  };
}
