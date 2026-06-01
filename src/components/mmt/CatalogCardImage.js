"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80";

/** Cab/driver card image with fallback when CDN or backend URL 404s. */
export default function CatalogCardImage({
  src,
  alt,
  className = "object-cover",
  objectPosition,
  sizes = "(max-width:640px) 108px, 280px"
}) {
  const [current, setCurrent] = useState(src || FALLBACK);

  useEffect(() => {
    setCurrent(src || FALLBACK);
  }, [src]);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
    />
  );
}
