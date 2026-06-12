import { catalogPublicPath } from "./catalogProduct";
import { resolveMediaUrl } from "./media";
import { buildPageMetadata, productJsonLd } from "./seo";

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

  const title = cab.seoTitle || `Book ${cab.title} in ${cab.city || "South India"} | Taxi & Outstation | cabzii.in`;
  const description =
    cab.seoDescription ||
    `Rent ${cab.title} — ${cab.type} taxi car with AC, local 4hr/8hr & outstation packages from ${cab.vendor} on cabzii.in.`;
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
      category: `${cab.type || "Cab"} · Taxi Booking`
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
    `Hire ${driver.name} Acting Driver in ${driver.city || "South India"} | Chauffeur on Your Car | cabzii.in`;
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

  const path = detailPath(pkg, "/holidays", id);
  const title = pkg.seoTitle || `${pkg.name} – Holiday Package | cabzii.in`;
  const description =
    pkg.seoDescription ||
    `Book ${pkg.name} with ${pkg.vendor} on cabzii.in. Toll, permit and driver bata billed separately.`;
  const keywords = (pkg.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(pkg.image);

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: pkg.imageAlt || pkg.imageTitle || pkg.name
    }),
    jsonLd: productJsonLd({
      name: pkg.name,
      description,
      urlPath: path,
      image: image || undefined,
      price: pkg.price,
      ...(pkg.originalPrice && Number(pkg.originalPrice) > Number(pkg.price)
        ? { lowPrice: pkg.price, highPrice: pkg.originalPrice }
        : {}),
      category: "Holiday Tour Package"
    })
  };
}
