import { resolveMediaUrl } from "./media";
import { buildPageMetadata, productJsonLd } from "./seo";

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

  const title = cab.seoTitle || `${cab.title} – ${cab.type} Cab Booking`;
  const description =
    cab.seoDescription ||
    `Book ${cab.title} by ${cab.vendor}. Local & outstation packages on cabzii.in.`;
  const keywords = (cab.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(cab.image);

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path: `/cabs/${id}`,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: cab.title
    }),
    jsonLd: productJsonLd({
      name: cab.title,
      description,
      urlPath: `/cabs/${id}`,
      image: image || undefined,
      price: cab.price
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

  const title = driver.seoTitle || `${driver.name} – Professional Driver Booking`;
  const description =
    driver.seoDescription ||
    `Book ${driver.name} on cabzii.in. Acting driver packages with transparent pricing.`;
  const keywords = (driver.seo || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const image = resolveMediaUrl(driver.image);

  return {
    metadata: buildPageMetadata({
      title,
      description,
      path: `/drivers/${id}`,
      keywords: keywords.length ? keywords : undefined,
      image,
      imageAlt: driver.name
    }),
    jsonLd: productJsonLd({
      name: driver.name,
      description,
      urlPath: `/drivers/${id}`,
      image: image || undefined,
      price: driver.pricing?.day || driver.pricing?.hourly
    })
  };
}

export function packageDetailMetadata(pkg, id) {
  if (!pkg) {
    return {
      metadata: buildPageMetadata({
        title: "Tour Package Not Found",
        description: "This tour package is not available on Cabzii.",
        path: `/packages/${id}`,
        noindex: true
      }),
      jsonLd: null
    };
  }

  const path = `/packages/${id}`;
  const title = pkg.seoTitle || `${pkg.name} – Tour Package`;
  const description =
    pkg.seoDescription ||
    `Book ${pkg.name} (${pkg.duration}) with ${pkg.vendor} on cabzii.in.`;
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
      imageAlt: pkg.name
    }),
    jsonLd: productJsonLd({
      name: pkg.name,
      description,
      urlPath: path,
      image: image || undefined,
      price: pkg.price
    })
  };
}
