"use client";

import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../lib/media";

const FALLBACK =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80";

/** Cab/driver card image with fallback when upload URL 404s. */
export default function CatalogCardImage({
  src,
  alt,
  className = "object-cover",
  objectPosition,
  sizes = "(max-width:640px) 108px, 280px"
}) {
  const resolved = resolveMediaUrl(src) || FALLBACK;
  const [current, setCurrent] = useState(resolved);

  useEffect(() => {
    setCurrent(resolveMediaUrl(src) || FALLBACK);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      sizes={sizes}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
