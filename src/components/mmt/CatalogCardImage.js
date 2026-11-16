"use client";

import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../lib/media";
import { CARD_IMAGE_WIDTH, optimizeImageUrl } from "../../lib/imageOptimize";
import { stockImageForProduct } from "../../lib/vehicleImages";
import { isPlaceholderProductImage } from "../../lib/dynamicImageSeo";
import CabSilhouette from "../icons/CabSilhouette";

function isCabProduct(product) {
  if (!product || typeof product !== "object") return false;
  if (product.languages || product.supportedVehicles) return false;
  return Boolean(product.vehicleModel || product.vehicleName || product.farePackages || product.type);
}

/**
 * Cab cards use SVG silhouettes (template fleet art).
 * Driver / bus cards keep a photo when one is uploaded.
 */
export default function CatalogCardImage({
  src,
  alt,
  product,
  className = "object-cover",
  objectPosition,
  sizes = "(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw",
  priority = false,
  illustration = false
}) {
  const useCabArt = illustration === true || (illustration !== false && isCabProduct(product));
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (useCabArt) return;
    const nextUploaded = resolveMediaUrl(src);
    const next =
      nextUploaded && !isPlaceholderProductImage(nextUploaded)
        ? nextUploaded
        : stockImageForProduct(product || { title: alt });
    setCurrent(optimizeImageUrl(next, CARD_IMAGE_WIDTH));
  }, [src, alt, product, useCabArt]);

  if (useCabArt) {
    const safeClass = String(className || "")
      .replace("object-cover", "")
      .replace("object-contain", "");
    return (
      <CabSilhouette
        product={product}
        label={alt}
        className={`absolute inset-0 h-full w-full ${safeClass}`}
      />
    );
  }

  return (
    <img
      src={current}
      alt={alt || product?.imageAlt || product?.title || "Cab"}
      title={product?.imageTitle || alt || undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      width={640}
      height={400}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => {
        const next = optimizeImageUrl(stockImageForProduct(product || { title: alt }), CARD_IMAGE_WIDTH);
        if (current !== next) setCurrent(next);
      }}
    />
  );
}
