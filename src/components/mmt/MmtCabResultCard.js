"use client";

import Link from "next/link";
import { buildFareSlabs } from "../../lib/cabFare";
import { resolveCabTripFare } from "../../lib/distanceFare";
import { catalogPublicPath } from "../../lib/catalogProduct";
import {
  getCabCatalogSubtitle,
  getCabDisplaySubtitle,
  getCabDisplayTitle,
  getCabVehicleName,
  getCatalogPerKmFare
} from "../../lib/catalogDisplay";
import { formatCabSeatLabel, inferPassengerSeats } from "../../lib/cabSeats";
import { resolveCabImage } from "../../lib/vehicleImages";
import { cabSlabForTrip, tripToSearchQuery } from "../../lib/mmtTrip";
import { FuelIcon, LuggageIcon, PersonIcon, SnowflakeIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import MmtCardPriceBlock from "./MmtCardPriceBlock";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";

export default function MmtCabResultCard({ cab, trip, layout = "row", catalogMode = false, displayCity = "" }) {
  const id = String(cab._id ?? cab.id ?? "");
  const slabs = buildFareSlabs(cab);
  const catalogPerKm = catalogMode ? getCatalogPerKmFare(cab, slabs) : null;
  const slab = catalogMode ? null : cabSlabForTrip(slabs, trip);
  const fare = catalogMode ? null : resolveCabTripFare(cab, slab, trip);
  const listPrice = catalogMode ? 0 : fare.listPrice;
  const discount = catalogMode ? 0 : fare.discountPct;
  const total = catalogMode ? 0 : fare.total;

  const passengerSeats = inferPassengerSeats(cab);
  const seatLabel = formatCabSeatLabel(cab);
  const bags = cab.bags ?? (passengerSeats >= 6 ? 3 : 2);
  const imageSrc = resolveCabImage(cab);
  const vehicleName = getCabVehicleName(cab);
  const imageAlt = cab.imageAlt || vehicleName;

  const href = catalogMode
    ? catalogPublicPath(cab, "/cabs")
    : `/cabs/passenger?${(() => {
        const detailParams = tripToSearchQuery(trip);
        detailParams.set("cabId", id);
        return detailParams.toString();
      })()}`;

  const title = catalogMode ? vehicleName : getCabDisplayTitle(cab, trip);
  const subtitle = catalogMode ? getCabCatalogSubtitle(cab, displayCity) : getCabDisplaySubtitle(cab, trip);

  if (layout === "card") {
    return (
      <CatalogVehicleCard
        href={href}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        imageProduct={cab}
        title={title}
        subtitle={subtitle}
        features={
          <>
            <FeatureChip icon={PersonIcon}>{seatLabel} seats</FeatureChip>
            <FeatureChip icon={LuggageIcon}>{bags} bags</FeatureChip>
            <FeatureChip icon={SnowflakeIcon}>AC</FeatureChip>
            <FeatureChip icon={FuelIcon}>Fuel incl.</FeatureChip>
          </>
        }
        priceBlockProps={{
          originalPrice: listPrice,
          finalPrice: total,
          discountPct: discount,
          compact: true,
          perKmRate: catalogMode ? catalogPerKm.perKmRate : undefined,
          fareNote: catalogMode ? catalogPerKm.fareNote : fare?.usesDistance ? `₹${fare.perKmRate}/km` : undefined
        }}
      />
    );
  }

  const features = (
    <>
      <span className="inline-flex items-center gap-1">
        <PersonIcon className="h-3.5 w-3.5" /> {seatLabel} Seats
      </span>
      <span className="inline-flex items-center gap-1">
        <LuggageIcon className="h-3.5 w-3.5" /> {bags} Bags
      </span>
      <span className="inline-flex items-center gap-1">
        <SnowflakeIcon className="h-3.5 w-3.5" /> AC
      </span>
      <span className="inline-flex items-center gap-1">
        <FuelIcon className="h-3.5 w-3.5" /> Fuel included
      </span>
    </>
  );

  return (
    <article className="cabzii-card cabzii-card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:aspect-auto sm:h-24 sm:w-40">
        <CatalogCardImage src={imageSrc} alt={imageAlt} product={cab} sizes="160px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{features}</div>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <MmtCardPriceBlock
          originalPrice={listPrice}
          finalPrice={total}
          discountPct={discount}
          perKmRate={catalogMode ? catalogPerKm?.perKmRate : undefined}
          fareNote={catalogMode ? catalogPerKm?.fareNote : fare?.usesDistance ? `₹${fare.perKmRate}/km` : undefined}
        />
        <Link href={href} className="cabzii-btn cabzii-btn-primary shrink-0">
          {catalogMode ? "View" : "Select"}
        </Link>
      </div>
    </article>
  );
}
