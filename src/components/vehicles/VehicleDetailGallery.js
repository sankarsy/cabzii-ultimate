"use client";

import { useMemo, useState } from "react";
import { resolveMediaUrl } from "../../lib/media";
import { optimizeImageUrl } from "../../lib/imageOptimize";
import { vehiclePhotoAlt } from "../../lib/catalogDisplay";
import { resolveCabImage } from "../../lib/vehicleImages";

function galleryImages(cab) {
  const shortAlt = vehiclePhotoAlt(cab);
  const fallback = resolveCabImage(cab);
  const seen = new Set();
  const out = [];

  const push = (rawUrl, alt, type) => {
    const url = resolveMediaUrl(rawUrl) || String(rawUrl || "").trim();
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ url, alt: alt || shortAlt, type: type || "gallery" });
  };

  if (Array.isArray(cab?.images) && cab.images.length) {
    [...cab.images]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .forEach((img) => push(img?.url, img?.alt || shortAlt, img?.type));
  } else {
    if (cab?.image) push(cab.image, cab.imageAlt || shortAlt, "cover");
    if (Array.isArray(cab?.gallery)) {
      cab.gallery.forEach((url, i) => push(url, `${shortAlt} photo ${i + 1}`, "gallery"));
    }
  }

  if (!out.length && fallback) push(fallback, shortAlt, "cover");
  return out;
}

export default function VehicleDetailGallery({ cab }) {
  const images = useMemo(() => galleryImages(cab), [cab]);
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState({});
  const fallbackSrc = resolveCabImage(cab);
  const shortAlt = vehiclePhotoAlt(cab);

  const current = images[active] || images[0];
  const rawSrc = current?.url || fallbackSrc;
  const src =
    broken[rawSrc] && fallbackSrc && fallbackSrc !== rawSrc
      ? optimizeImageUrl(fallbackSrc, 640)
      : optimizeImageUrl(rawSrc, 640);

  if (!src) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-center text-[11px] text-slate-500 md:h-56 lg:h-64">
        {shortAlt}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <img
          key={src}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={src}
          alt={shortAlt}
          width={640}
          height={400}
          onError={() => {
            if (!rawSrc) return;
            setBroken((prev) => (prev[rawSrc] ? prev : { ...prev, [rawSrc]: true }));
          }}
          className="h-44 w-full object-contain object-center md:h-56 lg:h-64"
        />
        {images.length > 1 ? (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {Math.min(active + 1, images.length)} / {images.length}
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="scroll-x-touch flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-14 sm:w-20 sm:rounded-lg ${
                i === active ? "border-sky-400 ring-1 ring-sky-200" : "border-slate-200 opacity-80 hover:opacity-100"
              }`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={optimizeImageUrl(img.url, 192)}
                alt={img.alt || `${shortAlt} ${i + 1}`}
                width={192}
                height={128}
                className="h-full w-full object-cover"
                onError={(e) => {
                  if (fallbackSrc) e.currentTarget.src = optimizeImageUrl(fallbackSrc, 192);
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
