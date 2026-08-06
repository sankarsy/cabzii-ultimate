"use client";

import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useVehicleWishlist } from "../../lib/useVehicleWishlist";

export default function VehicleActionButtons({ vehicleId, className = "" }) {
  const id = String(vehicleId || "");
  const { toggle, isWishlisted } = useVehicleWishlist();

  if (!id) return null;

  const wishlisted = isWishlisted(id);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(id);
          toast.info(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur transition hover:scale-105 sm:h-9 sm:w-9 ${
          wishlisted ? "border-rose-200 text-rose-400" : "border-slate-200 text-slate-400 hover:text-rose-400"
        }`}
      >
        <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wishlisted ? "fill-current" : ""}`} strokeWidth={2} />
      </button>
    </div>
  );
}
