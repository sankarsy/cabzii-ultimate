"use client";

import Link from "next/link";
import { buildFareSlabs, num, packageYouPay } from "../../lib/cabFare";
import { resolveMediaUrl } from "../../lib/media";
import { cabSlabForTrip, tripToSearchQuery } from "../../lib/mmtTrip";
import { FuelIcon, LuggageIcon, PersonIcon, SnowflakeIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import MmtCardPriceBlock from "./MmtCardPriceBlock";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";

export default function MmtCabResultCard({ cab, trip, layout = "row" }) {
  const id = String(cab._id ?? cab.id ?? "");
  const slabs = buildFareSlabs(cab);
  const slab = cabSlabForTrip(slabs, trip);

  const listPrice = num(slab?.originalPrice) || num(slab?.list) || num(cab.price);
  const discount = num(slab?.discountPercentage) || num(cab.discountPercentage);
  const total = num(slab?.price) > 0 ? num(slab.price) : packageYouPay(listPrice, discount);

  const seats = cab.seats ?? (cab.type?.includes("SUV") ? 6 : cab.type?.includes("Innova") ? 7 : 4);
  const bags = cab.bags ?? (seats >= 6 ? 3 : 2);
  const imageSrc = resolveMediaUrl(cab.image);

  const detailParams = tripToSearchQuery(trip);
  detailParams.set("cabId", id);
  const href = `/cabs/passenger?${detailParams.toString()}`;

  const title = cab.title || "Cab";
  const subtitle = `${cab.type} · ${cab.vendor}${cab.city ? ` · ${cab.city}` : ""}`;
  const packageLine = slab?.label ? `Package: ${slab.label}` : null;

  if (layout === "card") {
    return (
      <CatalogVehicleCard
        href={href}
        imageSrc={imageSrc}
        imageAlt={title}
        title={title}
        subtitle={subtitle}
        features={
          <>
            <FeatureChip icon={PersonIcon}>{seats} seats</FeatureChip>
            <FeatureChip icon={LuggageIcon}>{bags} bags</FeatureChip>
            <FeatureChip icon={SnowflakeIcon}>AC</FeatureChip>
            <FeatureChip icon={FuelIcon}>Fuel incl.</FeatureChip>
          </>
        }
        packageLine={packageLine}
        priceBlockProps={{
          originalPrice: listPrice,
          finalPrice: total,
          discountPct: discount,
          compact: true
        }}
      />
    );
  }

  const features = (
    <>
      <span className="inline-flex items-center gap-1">
        <PersonIcon className="h-3.5 w-3.5" /> {seats} Seats
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
        <CatalogCardImage src={imageSrc} alt={title} sizes="160px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{features}</div>
        {packageLine ? <p className="mt-2 text-xs text-slate-500">{packageLine}</p> : null}
      </div>
      <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <MmtCardPriceBlock originalPrice={listPrice} finalPrice={total} discountPct={discount} />
        <Link href={href} className="cabzii-btn cabzii-btn-primary shrink-0">
          Select
        </Link>
      </div>
    </article>
  );
}
