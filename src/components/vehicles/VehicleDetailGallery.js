"use client";

import { useState } from "react";
import { resolveMediaUrl } from "../../lib/media";
import { optimizeImageUrl } from "../../lib/imageOptimize";
import { resolveCabImage } from "../../lib/vehicleImages";

function galleryImages(cab) {
  if (Array.isArray(cab?.images) && cab.images.length) {
    return [...cab.images]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((img) => ({ url: img.url, alt: img.alt || cab.title, type: img.type }));
  }
  const urls = [];
  if (cab?.image) urls.push({ url: cab.image, alt: cab.imageAlt || cab.title, type: "cover" });
  if (Array.isArray(cab?.gallery)) {
    cab.gallery.forEach((url, i) => {
      if (url && url !== cab.image) urls.push({ url, alt: `${cab.title} photo ${i + 1}`, type: "gallery" });
    });
  }
  if (!urls.length) urls.push({ url: resolveCabImage(cab), alt: cab?.title || "Cab", type: "cover" });
  return urls;
}

export default function VehicleDetailGallery({ cab }) {
  const images = galleryImages(cab);
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];
  const heroAlt = current?.alt || cab?.imageAlt || cab?.title || "Vehicle photo";

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={optimizeImageUrl(resolveMediaUrl(current?.url), 960)}
          alt={heroAlt}
          width={960}
          height={600}
          className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]"
        />
        {images.length > 1 ? (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
            {active + 1} / {images.length}
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="scroll-x-touch flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? "border-sky-400 ring-2 ring-sky-200" : "border-slate-200 opacity-80 hover:opacity-100"
              }`}
            >
              <img
                loading="lazy"
                decoding="async"
                src={optimizeImageUrl(resolveMediaUrl(img.url), 192)}
                alt={img.alt || `Photo ${i + 1}`}
                width={192}
                height={128}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
