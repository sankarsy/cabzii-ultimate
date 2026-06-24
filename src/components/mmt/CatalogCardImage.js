"use client";

import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../lib/media";
import { stockImageForProduct } from "../../lib/vehicleImages";

/** Cab/driver card image — uploaded photo or type-aware stock image. */
export default function CatalogCardImage({
  src,
  alt,
  product,
  className = "object-cover",
  objectPosition,
  sizes = "(max-width:640px) 108px, 280px"
}) {
  const uploaded = resolveMediaUrl(src);
  const fallback = stockImageForProduct(product || { title: alt });
  const resolved = uploaded || fallback;
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    setCurrent(resolveMediaUrl(src) || stockImageForProduct(product || { title: alt }));
  }, [src, alt, product]);

  return (
    <img
      src={current}
      alt={alt || "Cab"}
      title={product?.imageTitle || alt || undefined}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => {
        const next = stockImageForProduct(product || { title: alt });
        if (current !== next) setCurrent(next);
      }}
    />
  );
}
