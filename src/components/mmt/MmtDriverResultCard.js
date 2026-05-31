"use client";

import Image from "next/image";
import Link from "next/link";
import { buildDriverFareSlabs, num } from "../../lib/driverFare";
import { packageYouPay } from "../../lib/cabFare";
import { driverSlabForTrip, driverTripToSearchQuery } from "../../lib/driverTrip";
import { resolveMediaUrl } from "../../lib/media";
import MmtCardPriceBlock from "./MmtCardPriceBlock";

const FALLBACK =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80";

export default function MmtDriverResultCard({ driver, trip, layout = "row" }) {
  const id = String(driver._id ?? driver.id ?? "");
  const slabs = buildDriverFareSlabs(driver);
  const slab = driverSlabForTrip(slabs, trip);
  const listPrice = num(slab?.originalPrice) || num(slab?.list) || 0;
  const discount = num(slab?.discountPercentage) || num(driver.discountPercentage);
  const total = num(slab?.price) > 0 ? num(slab.price) : packageYouPay(listPrice || 1, discount);
  const imageSrc = resolveMediaUrl(driver.image) || FALLBACK;
  const displayName = driver.name || driver.serviceTitle || "Driver";
  const vehicle = driver.supportedVehicles?.[0] || "Your vehicle";
  const languages = Array.isArray(driver.languages) ? driver.languages.slice(0, 2).join(", ") : "";

  const detailParams = driverTripToSearchQuery(trip);
  detailParams.set("driverId", id);
  const href = `/drivers/passenger?${detailParams.toString()}`;

  const subtitle = (
    <>
      {driver.vendor || "Cabzii Partner"}
      {driver.city ? ` · ${driver.city}` : ""}
    </>
  );
  const features = (
    <>
      <span>💼 {driver.experience || "Experienced"}</span>
      <span>🛣️ {driver.trips ?? 0} trips</span>
      <span>🚗 {vehicle}</span>
      <span>✅ Allowance included</span>
      {languages ? <span>🗣️ {languages}</span> : null}
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
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            sizes="(max-width:640px) 85vw, 280px"
            className="object-cover object-top"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-1 text-base font-bold text-slate-900">{displayName}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">{features}</div>
          {packageLine ? <div className="mt-2">{packageLine}</div> : null}
          <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">{priceBlock}</div>
            {selectBtn}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="relative h-28 w-full shrink-0 sm:h-24 sm:w-40">
        <Image src={imageSrc} alt={displayName} fill sizes="160px" className="rounded-lg object-cover object-top" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold text-slate-900">{displayName}</h3>
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
