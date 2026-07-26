"use client";

import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../lib/media";
import { CARD_IMAGE_WIDTH, optimizeImageUrl } from "../../lib/imageOptimize";
import { stockImageForProduct } from "../../lib/vehicleImages";

/** Cab/driver card image — uploaded photo or type-aware stock image. */
export default function CatalogCardImage({
  src,
  alt,
  product,
  className = "object-cover",
  objectPosition,
  sizes = "(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw",
  priority = false
}) {
  const uploaded = resolveMediaUrl(src);
  const fallback = stockImageForProduct(product || { title: alt });
  const resolved = optimizeImageUrl(uploaded || fallback, CARD_IMAGE_WIDTH);
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    const next = optimizeImageUrl(
      resolveMediaUrl(src) || stockImageForProduct(product || { title: alt }),
      CARD_IMAGE_WIDTH
    );
    setCurrent(next);
  }, [src, alt, product]);

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
