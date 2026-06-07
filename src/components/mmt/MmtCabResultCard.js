"use client";

import Link from "next/link";
import { buildFareSlabs, num, packageYouPay } from "../../lib/cabFare";
import { resolveMediaUrl } from "../../lib/media";
import { cabSlabForTrip, tripToSearchQuery } from "../../lib/mmtTrip";
import { FuelIcon, LuggageIcon, PersonIcon, SnowflakeIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import MmtCardPriceBlock from "./MmtCardPriceBlock";

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
  const subtitle = (
    <>
      {cab.type} · {cab.vendor}
      {cab.city ? ` · ${cab.city}` : ""}
    </>
  );
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
  const packageLine = slab?.label ? <p className="text-xs text-slate-500">Package: {slab.label}</p> : null;
  const priceBlock = (
    <MmtCardPriceBlock
      originalPrice={listPrice}
      finalPrice={total}
      discountPct={discount}
      compact={layout === "card"}
    />
  );
  const selectBtn = (
    <Link
      href={href}
      className={
        layout === "card"
          ? "inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--emt-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--emt-primary-dark)] sm:px-6 sm:py-2.5 sm:text-sm"
          : "rounded-full bg-[var(--emt-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--emt-primary-dark)]"
      }
    >
      Select
    </Link>
  );

  if (layout === "card") {
    return (
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
        <div className="flex flex-row items-stretch sm:flex-col">
          <div className="relative w-[6.75rem] shrink-0 self-stretch bg-slate-100 sm:w-full sm:aspect-[4/3] sm:self-auto">
            <CatalogCardImage src={imageSrc} alt={title} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-2.5 sm:gap-2 sm:p-3">
            <div className="min-w-0 space-y-0.5">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:line-clamp-1 sm:text-base">
                {title}
              </h3>
              <p className="line-clamp-2 text-[11px] leading-snug text-slate-500 sm:line-clamp-1 sm:text-sm">{subtitle}</p>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                <span>👤 {seats}</span>
                <span>❄️ AC</span>
                <span className="hidden sm:inline">🧳 {bags}</span>
              </div>
              {packageLine ? <div className="pt-0.5">{packageLine}</div> : null}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2 sm:flex-col sm:items-stretch sm:gap-2.5 sm:pt-3">
              <div className="min-w-0 flex-1">{priceBlock}</div>
              <div className="shrink-0 sm:w-full sm:[&_a]:flex sm:[&_a]:w-full sm:[&_a]:justify-center">{selectBtn}</div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="relative h-28 w-full shrink-0 sm:h-24 sm:w-40">
        <CatalogCardImage src={imageSrc} alt={title} sizes="160px" className="rounded-lg object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{features}</div>
        {packageLine ? <div className="mt-2">{packageLine}</div> : null}
      </div>
      <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <div className="text-right">{priceBlock}</div>
        {selectBtn}
      </div>
    </div>
  );
}
