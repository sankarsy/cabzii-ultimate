import { resolveMediaUrl } from "./media";
import {
  detectServiceKind,
  resolveCoverImage,
  resolveImageAlt,
  resolveProductImageSeo,
  serviceFallbackPath
} from "./dynamicImageSeo";

/** @deprecated Use SERVICE_FALLBACK_PATHS via dynamicImageSeo — kept for import compatibility. */
export const VEHICLE_STOCK_IMAGES = {
  dzire: serviceFallbackPath("cab"),
  etios: serviceFallbackPath("cab"),
  wagon: serviceFallbackPath("cab"),
  hatchback: serviceFallbackPath("cab"),
  innova: serviceFallbackPath("suv"),
  ertiga: serviceFallbackPath("suv"),
  suv: serviceFallbackPath("suv"),
  tempo: serviceFallbackPath("tempo"),
  van: serviceFallbackPath("tempo"),
  bus: serviceFallbackPath("bus"),
  sedan: serviceFallbackPath("cab")
};

export { detectServiceKind as detectVehicleImageKey };

export function stockImageForProduct(product = {}) {
  return serviceFallbackPath(detectServiceKind(product));
}

/** Uploaded cover/gallery first; local service fallback last — never a hardcoded CDN product photo. */
export function resolveCabImage(cab = {}) {
  return resolveCoverImage(cab, { kind: "cab" }).url;
}

export function resolveDriverImage(driver = {}) {
  return resolveCoverImage(driver, { kind: "driver" }).url;
}

export function resolvePackageImage(pkg = {}) {
  return resolveCoverImage(pkg, { kind: "holiday" }).url;
}

export function resolveProductDisplayImage(product = {}, kind) {
  const seo = resolveProductImageSeo(product, { kind });
  return {
    src: seo.displayUrl || seo.coverUrl,
    alt: seo.alt,
    title: seo.title,
    absoluteUrl: seo.absoluteUrl
  };
}

export function resolveCabImageAlt(cab = {}) {
  return resolveImageAlt(cab, resolveCoverImage(cab, { kind: "cab" }), { kind: "cab" });
}

export function resolveUploadedOrFallback(url, product = {}, kind) {
  const uploaded = resolveMediaUrl(url);
  if (uploaded) return uploaded;
  return resolveCoverImage(product, { kind }).url;
}
