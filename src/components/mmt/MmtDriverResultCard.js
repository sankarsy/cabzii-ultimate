"use client";

import Link from "next/link";
import { buildDriverFareSlabs, formatDriverRating, num } from "../../lib/driverFare";
import { packageYouPay } from "../../lib/cabFare";
import { driverSlabForTrip, driverTripToSearchQuery } from "../../lib/driverTrip";
import { resolveMediaUrl } from "../../lib/media";
import { BriefcaseIcon, CarIcon, CheckIcon, LangIcon, RouteIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import MmtCardPriceBlock from "./MmtCardPriceBlock";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";
import RatingBadge from "../ui/RatingBadge";

export default function MmtDriverResultCard({ driver, trip, layout = "row" }) {
  const id = String(driver._id ?? driver.id ?? "");
  const slabs = buildDriverFareSlabs(driver);
  const slab = driverSlabForTrip(slabs, trip);
  const listPrice = num(slab?.originalPrice) || num(slab?.list) || 0;
  const discount = num(slab?.discountPercentage) || num(driver.discountPercentage);
  const total =
    num(slab?.price) > 0 ? num(slab.price) : listPrice > 0 ? packageYouPay(listPrice, discount) : 0;
  const imageSrc = resolveMediaUrl(driver.image);
  const displayName = driver.name || driver.serviceTitle || "Driver";
  const vehicle = driver.supportedVehicles?.[0] || "Your vehicle";
  const languages = Array.isArray(driver.languages) ? driver.languages.slice(0, 2).join(", ") : "";
  const rating = formatDriverRating(driver);
  const reviewCount = driver.reviewCount ?? driver.reviews;

  const detailParams = driverTripToSearchQuery(trip);
  detailParams.set("driverId", id);
  const href = `/drivers/passenger?${detailParams.toString()}`;

  const subtitle = `${driver.vendor || "Cabzii Partner"}${driver.city ? ` · ${driver.city}` : ""}`;
  const packageLine = slab?.label ? `Package: ${slab.label}` : null;

  if (layout === "card") {
    return (
      <CatalogVehicleCard
        href={href}
        imageSrc={imageSrc}
        imageAlt={displayName}
        imageObjectPosition="top"
        title={displayName}
        subtitle={subtitle}
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            {rating ? <RatingBadge rating={rating} reviewCount={reviewCount} /> : null}
          </div>
        }
        features={
          <>
            <FeatureChip icon={BriefcaseIcon}>{driver.experience || "Experienced"}</FeatureChip>
            <FeatureChip icon={RouteIcon}>{driver.trips ?? 0} trips</FeatureChip>
            <FeatureChip icon={CarIcon}>{vehicle}</FeatureChip>
            {languages ? <FeatureChip icon={LangIcon}>{languages}</FeatureChip> : null}
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
        <BriefcaseIcon className="h-3.5 w-3.5" /> {driver.experience || "Experienced"}
      </span>
      <span className="inline-flex items-center gap-1">
        <RouteIcon className="h-3.5 w-3.5" /> {driver.trips ?? 0} trips
      </span>
      <span className="inline-flex items-center gap-1">
        <CarIcon className="h-3.5 w-3.5" /> {vehicle}
      </span>
      <span className="inline-flex items-center gap-1">
        <CheckIcon className="h-3.5 w-3.5" /> Allowance included
      </span>
      {languages ? (
        <span className="inline-flex items-center gap-1">
          <LangIcon className="h-3.5 w-3.5" /> {languages}
        </span>
      ) : null}
    </>
  );

  return (
    <article className="cabzii-card cabzii-card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:aspect-auto sm:h-28 sm:w-32">
        <CatalogCardImage
          src={imageSrc}
          alt={displayName}
          sizes="128px"
          className="object-cover object-top"
          objectPosition="top"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">{displayName}</h3>
          {rating ? <RatingBadge rating={rating} reviewCount={reviewCount} /> : null}
        </div>
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
