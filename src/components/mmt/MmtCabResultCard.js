"use client";

import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";
import { buildFareSlabs, formatRating } from "../../lib/cabFare";
import { resolveCabTripFare } from "../../lib/distanceFare";
import { catalogPublicPath } from "../../lib/catalogProduct";
import {
  getCabCatalogSubtitle,
  getCabDisplaySubtitle,
  getCabDisplayTitle,
  getCabVehicleName,
  getCatalogPerKmFare,
  vehiclePhotoAlt
} from "../../lib/catalogDisplay";
import { formatCabSeatLabel, inferPassengerSeats } from "../../lib/cabSeats";
import { resolveCabImage } from "../../lib/vehicleImages";
import { cabSlabForTrip, tripToSearchQuery } from "../../lib/mmtTrip";
import { FuelIcon, LuggageIcon, PersonIcon, SnowflakeIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";
import { trackEvent } from "../../lib/analytics";
import { formatInrCurrency } from "../../lib/formatInr";

function formatINR(n) {
  return formatInrCurrency(n);
}

export default function MmtCabResultCard({ cab, trip, layout = "row", catalogMode = false, displayCity = "" }) {
  const id = String(cab._id ?? cab.id ?? "");
  const slabs = buildFareSlabs(cab);
  const catalogPerKm = catalogMode ? getCatalogPerKmFare(cab, slabs) : null;
  const slab = catalogMode ? null : cabSlabForTrip(slabs, trip);
  const fare = catalogMode ? null : resolveCabTripFare(cab, slab, trip);
  const total = catalogMode ? catalogPerKm?.perKmRate || Number(cab.price) || 0 : fare?.total || Number(cab.price) || 0;
  const usesDistance = !catalogMode && fare?.usesDistance;
  const passengerSeats = inferPassengerSeats(cab);
  const seatLabel = formatCabSeatLabel(cab);
  const bags = cab.bags ?? (passengerSeats >= 6 ? 3 : 2);
  const imageSrc = resolveCabImage(cab);
  const vehicleName = getCabVehicleName(cab);
  const imageAlt = cab.imageAlt || vehiclePhotoAlt(cab);
  const ratingText = formatRating(cab);
  const reviewCountRaw = cab.reviewCount ?? cab.reviews;
  const reviewCount =
    reviewCountRaw != null && Number.isFinite(Number(reviewCountRaw)) ? Number(reviewCountRaw) : null;

  const href = catalogMode
    ? catalogPublicPath(cab, "/cabs")
    : `/cabs/passenger?${(() => {
        const detailParams = tripToSearchQuery(trip);
        detailParams.set("cabId", id);
        return detailParams.toString();
      })()}`;

  const trackSelect = () => {
    trackEvent("vehicle_selected", {
      service_type: "cab",
      vehicle_id: id,
      vehicle_name: vehicleName,
      city: displayCity || cab.city || trip?.from || "",
      route: [trip?.from, trip?.to].filter(Boolean).join(" → ")
    });
  };

  const title = catalogMode ? vehicleName : getCabDisplayTitle(cab, trip);
  const subtitle = catalogMode ? getCabCatalogSubtitle(cab, displayCity) : getCabDisplaySubtitle(cab, trip);

  const priceBlockProps = {
    originalPrice: total,
    finalPrice: total,
    discountPct: 0,
    compact: true,
    perKmRate: catalogMode ? catalogPerKm?.perKmRate : usesDistance ? fare?.perKmRate : undefined,
    distanceKm: usesDistance ? fare.distanceKm : undefined,
    roundTrip: Boolean(trip?.roundTrip),
    fareNote: catalogMode ? catalogPerKm?.fareNote : usesDistance ? fare?.fareNote : "package fare"
  };

  if (layout === "card") {
    return (
      <CatalogVehicleCard
        href={href}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        imageProduct={cab}
        title={title}
        subtitle={subtitle}
        onNavigate={trackSelect}
        features={
          <>
            <FeatureChip icon={PersonIcon}>{seatLabel} seats</FeatureChip>
            <FeatureChip icon={LuggageIcon}>{bags} bags</FeatureChip>
            <FeatureChip icon={SnowflakeIcon}>AC</FeatureChip>
            <FeatureChip icon={FuelIcon}>Fuel incl.</FeatureChip>
          </>
        }
        priceBlockProps={priceBlockProps}
      />
    );
  }

  const tags = [
    cab.type || "Cab",
    `${seatLabel} Seats`,
    `${bags} Bags`,
    "AC",
    "Fuel included"
  ];

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-100 bg-sky-50 px-4 py-1.5 text-[11px] font-semibold text-sky-800">
        <span className="inline-flex items-center gap-1 rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          <ShieldCheck className="h-3 w-3" /> Cabzii Assured
        </span>
        <span>{cab.vendor || "Cabzii Partner"} · verified listing</span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[112px_minmax(0,1.2fr)_minmax(0,1fr)_160px] lg:items-center">
        <div className="relative h-20 w-28 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-32 lg:h-[5.5rem] lg:w-28">
          <CatalogCardImage src={imageSrc} alt={imageAlt} product={cab} sizes="128px" className="object-cover" />
        </div>

        <div className="min-w-0">
          <p className="text-base font-extrabold text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>
          {ratingText ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                <Star className="h-3 w-3 fill-white" /> {ratingText}
              </span>
              {reviewCount != null ? <span className="text-[11px] text-slate-500">{reviewCount} ratings</span> : null}
            </div>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded border border-sky-200 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden text-xs text-slate-500 lg:block">
          {usesDistance ? (
            <>
              <p className="font-semibold text-slate-700">{Math.ceil(Number(fare.distanceKm) || 0)} km trip</p>
              <p className="mt-1">₹{fare.perKmRate}/km{trip?.roundTrip ? " · round trip" : ""}</p>
              <p className="mt-1 text-slate-400">Driver, fuel &amp; parking as per package</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-700">{slab?.label || "Package fare"}</p>
              <p className="mt-1">Extra km ₹{slab?.extraKm || 12}/km</p>
              <p className="mt-1">Extra hr ₹{slab?.extraHr || 250}/hr</p>
            </>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-2 lg:items-end">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">From</p>
          <p className="text-lg font-extrabold text-slate-900">{formatINR(total)}</p>
          {catalogMode && catalogPerKm?.perKmRate ? (
            <p className="text-[11px] text-slate-500">₹{catalogPerKm.perKmRate}/km</p>
          ) : (
            <p className="text-[11px] text-slate-500">package fare</p>
          )}
          <Link
            href={href}
            onClick={trackSelect}
            className="rounded-lg bg-[#d84e55] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#c03940]"
          >
            {catalogMode ? "View Cab" : "Select Cab"}
          </Link>
        </div>
      </div>
    </article>
  );
}
