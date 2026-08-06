/**
 * Dynamic product image SEO — admin cover/gallery drives cards, detail, OG, Twitter, schema & sitemap.
 * Never hardcode product photo URLs here; only local brand fallbacks under /images/fallbacks/.
 */

import { BRAND_OG_IMAGE } from "./brandAssets";
import { resolveMediaUrl } from "./media";
import { absoluteImageUrl, optimizeImageUrl, PRODUCT_OG_HEIGHT, PRODUCT_OG_WIDTH } from "./imageOptimize";
import { SITE_URL } from "./seo/constants";

/** Local fallbacks — replace files in /public/images/fallbacks/ without code changes. */
export const SERVICE_FALLBACK_PATHS = {
  cab: "/images/fallbacks/cab.svg",
  sedan: "/images/fallbacks/cab.svg",
  suv: "/images/fallbacks/suv.svg",
  tempo: "/images/fallbacks/tempo.svg",
  bus: "/images/fallbacks/bus.svg",
  driver: "/images/fallbacks/driver.svg",
  holiday: "/images/fallbacks/holiday.svg",
  hotel: "/images/fallbacks/hotel.svg",
  flight: "/images/fallbacks/flight.svg",
  airport: "/images/fallbacks/airport.svg",
  default: "/images/hero-banner.svg"
};

const GENERIC_ALT = /^(image|photo|picture|img|car|cab image|hotel image|untitled|null|undefined)$/i;

export function detectServiceKind(product = {}, forced = "") {
  if (forced) return forced;
  const text = [
    product.serviceKind,
    product.type,
    product.category,
    product.vehicleModel,
    product.title,
    product.name,
    product.busType,
    product.slug
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/airport/.test(text)) return "airport";
  if (/acting.?driver|chauffeur|driver on hire|driver/.test(text) && !/cab|taxi|dzire|innova/.test(text)) {
    return "driver";
  }
  if (/bus|volvo|sleeper|seater coach/.test(text)) return "bus";
  if (/hotel|resort|room/.test(text)) return "hotel";
  if (/flight|airline/.test(text)) return "flight";
  if (/holiday|tour|pilgrimage|package|ooty|tirupati/.test(text)) return "holiday";
  if (/tempo|traveller|van/.test(text)) return "tempo";
  if (/ertiga|innova|suv|xuv|creta/.test(text)) return "suv";
  return "cab";
}

export function serviceFallbackPath(kind = "default") {
  return SERVICE_FALLBACK_PATHS[kind] || SERVICE_FALLBACK_PATHS.default || BRAND_OG_IMAGE;
}

/** Normalize rich images[] + string gallery + cover field into ordered assets. */
export function collectProductImages(product = {}) {
  const out = [];
  const seen = new Set();

  const push = (raw, meta = {}) => {
    const url = resolveMediaUrl(raw?.url || raw);
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({
      url,
      alt: String(meta.alt || raw?.alt || "").trim(),
      title: String(meta.title || raw?.title || "").trim(),
      caption: String(meta.caption || raw?.caption || "").trim(),
      category: String(meta.category || raw?.type || meta.type || "gallery").trim() || "gallery",
      isCover: Boolean(meta.isCover || raw?.type === "cover" || meta.type === "cover"),
      width: Number(meta.width || raw?.width) || 0,
      height: Number(meta.height || raw?.height) || 0,
      order: Number.isFinite(Number(meta.order ?? raw?.sortOrder)) ? Number(meta.order ?? raw?.sortOrder) : out.length
    });
  };

  if (Array.isArray(product.images)) {
    [...product.images]
      .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
      .forEach((img, i) => push(img, { order: img?.sortOrder ?? i, type: img?.type, isCover: img?.type === "cover" }));
  }

  if (product.image) {
    push(product.image, {
      alt: product.imageAlt,
      title: product.imageTitle,
      isCover: !out.some((x) => x.isCover),
      category: "cover",
      order: -1
    });
  }

  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  gallery.forEach((g, i) => push(g, { category: "gallery", order: 100 + i }));

  out.sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    return a.order - b.order;
  });

  return out;
}

export function resolveCoverImage(product = {}, { kind } = {}) {
  const assets = collectProductImages(product);
  const cover = assets.find((a) => a.isCover) || assets[0];
  if (cover?.url) return cover;

  const es = product.enterpriseSeo || {};
  const og = resolveMediaUrl(es.ogImage || product.ogImage);
  if (og) {
    return {
      url: og,
      alt: product.imageAlt || "",
      title: product.imageTitle || "",
      caption: "",
      category: "cover",
      isCover: true,
      width: 0,
      height: 0,
      order: 0
    };
  }

  const fallbackKind = detectServiceKind(product, kind);
  return {
    url: serviceFallbackPath(fallbackKind),
    alt: "",
    title: "",
    caption: "",
    category: "fallback",
    isCover: true,
    width: 0,
    height: 0,
    order: 0,
    isFallback: true
  };
}

/**
 * Generate meaningful SEO alt text — never file names or generic words.
 * Pattern: [Service] + [Product] + [Location] + [Intent]
 */
export function suggestImageAlt(product = {}, { kind } = {}) {
  const serviceKind = detectServiceKind(product, kind);
  const location =
    product.city ||
    product.destination ||
    product.fromCity ||
    product.menuCitySlug ||
    product.pricingOriginCity ||
    "India";
  const loc = String(location).replace(/\b\w/g, (c) => c.toUpperCase());
  const name =
    product.vehicleName ||
    product.vehicleModel ||
    product.title ||
    product.name ||
    product.operator ||
    product.seoTitle ||
    "Cabzii";

  const templates = {
    cab: `${name} cab rental for airport and outstation travel in ${loc}`,
    sedan: `${name} sedan cab rental for airport and outstation travel in ${loc}`,
    suv: `${name} SUV cab rental for family and outstation trips in ${loc}`,
    tempo: `${name} tempo traveller rental for group travel in ${loc}`,
    driver: `Professional acting driver service for safe travel in ${loc}`,
    bus: `${name} AC bus rental for group travel and outstation trips from ${loc}`,
    holiday: `${name} holiday package with hotel stay and sightseeing in ${loc}`,
    hotel: `Premium hotel room with modern amenities in ${loc}`,
    flight: `Domestic and international flight booking service through Cabzii`,
    airport: `${loc} Airport pickup and drop cab service`
  };

  return templates[serviceKind] || templates.cab;
}

export function isWeakAlt(alt = "") {
  const t = String(alt || "").trim();
  if (!t || t.length < 8) return true;
  if (GENERIC_ALT.test(t)) return true;
  if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(t)) return true;
  if (/^img[_-]?\d+$/i.test(t)) return true;
  return false;
}

export function resolveImageAlt(product = {}, asset = null, opts = {}) {
  const candidates = [
    asset?.alt,
    product.imageAlt,
    product.imageTitle,
    opts.fallbackAlt
  ];
  for (const c of candidates) {
    if (c && !isWeakAlt(c)) return String(c).trim();
  }
  return suggestImageAlt(product, opts);
}

/**
 * Full social + schema + display bundle for a product.
 * Cover admin image → OG, Twitter, schema, sitemap entry.
 */
export function resolveProductImageSeo(product = {}, opts = {}) {
  const kind = detectServiceKind(product, opts.kind);
  const assets = collectProductImages(product);
  const cover = resolveCoverImage(product, { kind });
  const alt = resolveImageAlt(product, cover, { kind, fallbackAlt: opts.fallbackAlt });
  const title = (cover.title || product.imageTitle || product.title || product.name || alt).trim();
  const relativeUrl = cover.url;
  const absolute = absoluteImageUrl(relativeUrl, opts.siteUrl || SITE_URL);
  const displayUrl = optimizeImageUrl(relativeUrl, opts.displayWidth || 1200);
  const width = cover.width > 0 ? cover.width : opts.imageWidth || PRODUCT_OG_WIDTH;
  const height = cover.height > 0 ? cover.height : opts.imageHeight || PRODUCT_OG_HEIGHT;

  const es = product.enterpriseSeo && typeof product.enterpriseSeo === "object" ? product.enterpriseSeo : {};
  const ogAbsolute =
    absoluteImageUrl(resolveMediaUrl(es.ogImage), opts.siteUrl || SITE_URL) || absolute;
  const twitterAbsolute =
    absoluteImageUrl(resolveMediaUrl(es.twitterImage || es.ogImage), opts.siteUrl || SITE_URL) ||
    ogAbsolute;

  return {
    kind,
    coverUrl: relativeUrl,
    displayUrl,
    absoluteUrl: absolute,
    ogUrl: ogAbsolute,
    twitterUrl: twitterAbsolute,
    alt,
    title,
    caption: cover.caption || "",
    width,
    height,
    isFallback: Boolean(cover.isFallback),
    gallery: assets.map((a) => ({
      ...a,
      alt: resolveImageAlt(product, a, { kind }),
      absoluteUrl: absoluteImageUrl(a.url, opts.siteUrl || SITE_URL),
      displayUrl: optimizeImageUrl(a.url, opts.displayWidth || 800)
    })),
    openGraphImage: {
      url: ogAbsolute,
      alt,
      width,
      height
    },
    twitterImages: [twitterAbsolute],
    imageObject: {
      "@type": "ImageObject",
      url: absolute,
      contentUrl: absolute,
      caption: alt,
      name: title,
      ...(width ? { width } : {}),
      ...(height ? { height } : {})
    },
    sitemapImage: absolute
      ? {
          url: absolute,
          title,
          caption: alt
        }
      : null
  };
}

/** When cover URL changes, sync social fields (does not change slug/URL). */
export function syncSocialImagesFromCover(product = {}) {
  const next = { ...(product || {}) };
  const cover = resolveCoverImage(next);
  if (!cover?.url || cover.isFallback) return next;

  next.image = cover.url.startsWith("http") ? cover.url : cover.url;
  // Prefer stored path without resolving host for DB
  const rawCover =
    (Array.isArray(next.images) && (next.images.find((i) => i.type === "cover") || next.images[0])?.url) ||
    next.image;

  if (rawCover) next.image = rawCover;

  if (isWeakAlt(next.imageAlt)) {
    next.imageAlt = suggestImageAlt(next);
  }
  if (!String(next.imageTitle || "").trim()) {
    next.imageTitle = next.vehicleName || next.title || next.name || next.imageAlt;
  }

  const enterpriseSeo = {
    ...(next.enterpriseSeo && typeof next.enterpriseSeo === "object" ? next.enterpriseSeo : {})
  };
  enterpriseSeo.ogImage = rawCover || enterpriseSeo.ogImage || "";
  enterpriseSeo.twitterImage = rawCover || enterpriseSeo.twitterImage || "";
  next.enterpriseSeo = enterpriseSeo;
  next.ogImage = enterpriseSeo.ogImage;
  next.twitterImage = enterpriseSeo.twitterImage;

  if (Array.isArray(next.images) && next.images.length) {
    next.images = next.images.map((img, idx) => {
      const isCover = img.type === "cover" || (!next.images.some((x) => x.type === "cover") && idx === 0);
      if (!isCover) return img;
      return {
        ...img,
        type: img.type || "cover",
        alt: isWeakAlt(img.alt) ? next.imageAlt : img.alt,
        title: img.title || next.imageTitle
      };
    });
  }

  return next;
}
