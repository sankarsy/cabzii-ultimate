"use client";

import Link from "next/link";
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
import { cabFuelBadgeClass, cabFuelLabel } from "../../lib/cabListing";
import { resolveCabImage } from "../../lib/vehicleImages";
import { cabSlabForTrip, tripToSearchQuery } from "../../lib/mmtTrip";
import { FuelIcon, LuggageIcon, PersonIcon, SnowflakeIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";
import MmtCardPriceBlock from "./MmtCardPriceBlock";
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
  const fuelLabel = cabFuelLabel(cab);

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

  return (
    <Link
      href={href}
      onClick={trackSelect}
      className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
    >
      <div className="flex items-center gap-3 p-3 sm:gap-5 sm:p-4">
        <div className="relative flex h-[72px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 sm:h-[88px] sm:w-[148px]">
          <CatalogCardImage
            src={imageSrc}
            alt={imageAlt}
            product={cab}
            sizes="148px"
            className="object-contain p-1"
          />
          {fuelLabel ? (
            <span
              className={`absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white ${cabFuelBadgeClass(fuelLabel)}`}
            >
              {fuelLabel}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <h3 className="text-[15px] font-extrabold leading-tight text-slate-900 sm:text-[17px]">{vehicleName}</h3>
            {ratingText ? (
              <span className="text-[13px] font-bold text-[#1a73e8]">{ratingText}/5</span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[12px] text-slate-500 sm:text-[13px]">or similar</p>
          <p className="mt-1 text-[12px] font-medium text-slate-600 sm:text-[13px]">AC · {passengerSeats} Seats</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 pl-1">
          {catalogMode ? (
            <MmtCardPriceBlock {...priceBlockProps} compact />
          ) : (
            <>
              <p className="text-[18px] font-extrabold leading-none text-slate-900 sm:text-[22px]">{formatINR(total)}</p>
              <p className="hidden max-w-[9rem] text-right text-[11px] text-slate-500 sm:block">
                Tolls, parking &amp; GST extra if applicable
              </p>
            </>
          )}
          <span className="hidden min-w-[9.5rem] items-center justify-center rounded-lg bg-[#1a73e8] px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wide text-white sm:inline-flex">
            {catalogMode ? "View Cab" : "Select Cab"}
          </span>
        </div>
      </div>
    </Link>
  );
}
