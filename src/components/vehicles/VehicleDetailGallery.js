"use client";

import CabSilhouette from "../icons/CabSilhouette";
import { vehiclePhotoAlt } from "../../lib/catalogDisplay";

/** Cab detail visual — SVG silhouette instead of stock photos. */
export default function VehicleDetailGallery({ cab, size = "card" }) {
  const shortAlt = vehiclePhotoAlt(cab);
  const hero = size === "hero";

  return (
    <div
      className={`overflow-hidden bg-[var(--cabzii-sky)] ${
        hero ? "lg:h-full lg:min-h-[16rem]" : "rounded-2xl border border-[var(--cabzii-border)]"
      }`}
    >
      <CabSilhouette
        product={cab}
        label={shortAlt}
        size={hero ? "hero" : "card"}
        className={hero ? "h-36 w-full sm:h-44 lg:h-full lg:min-h-[16rem]" : "h-44 md:h-56 lg:h-64"}
      />
    </div>
  );
}
