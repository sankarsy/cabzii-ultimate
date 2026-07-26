"use client";

import Link from "next/link";
import { buildDriverFareSlabs, formatDriverRating } from "../../lib/driverFare";
import { resolveDriverTripFare } from "../../lib/distanceFare";
import { driverSlabForTrip, driverTripToSearchQuery } from "../../lib/driverTrip";
import { getCatalogHourlyFare, getDriverCatalogSubtitle, getDriverDisplaySubtitle, getDriverDisplayTitle } from "../../lib/catalogDisplay";
import { catalogPublicPath } from "../../lib/catalogProduct";
import { resolveMediaUrl } from "../../lib/media";
import { BriefcaseIcon, CarIcon, CheckIcon, ICON_SOFT_CLASS, LangIcon, RouteIcon } from "../icons";
import CatalogCardImage from "./CatalogCardImage";
import MmtCardPriceBlock from "./MmtCardPriceBlock";
import CatalogVehicleCard, { FeatureChip } from "../ui/CatalogVehicleCard";
import RatingBadge from "../ui/RatingBadge";

export default function MmtDriverResultCard({ driver, trip, layout = "row", catalogMode = false, displayCity = "" }) {
  const id = String(driver._id ?? driver.id ?? "");
  const slabs = buildDriverFareSlabs(driver);
  const catalogHourly = catalogMode ? getCatalogHourlyFare(driver, slabs) : null;
  const slab = catalogMode ? null : driverSlabForTrip(slabs, trip);
  const fare = catalogMode ? null : resolveDriverTripFare(driver, slab, trip);
  const listPrice = catalogMode ? 0 : fare.listPrice;
  const discount = catalogMode ? 0 : fare.discountPct;
  const total = catalogMode ? 0 : fare.total;
  const imageSrc = resolveMediaUrl(driver.image);
  const displayName = catalogMode
    ? getDriverDisplayTitle(driver, null)
    : getDriverDisplayTitle(driver, trip);
  const subtitle = catalogMode
    ? getDriverCatalogSubtitle(driver, displayCity)
    : getDriverDisplaySubtitle(driver, trip);
  const vehicle = driver.supportedVehicles?.[0] || "Your vehicle";
  const languages = Array.isArray(driver.languages) ? driver.languages.slice(0, 2).join(", ") : "";
  const rating = formatDriverRating(driver);
  const reviewCount = driver.reviewCount ?? driver.reviews;

  const href = catalogMode
    ? catalogPublicPath(driver, "/drivers")
    : `/drivers/passenger?${(() => {
        const detailParams = driverTripToSearchQuery(trip);
        detailParams.set("driverId", id);
        return detailParams.toString();
      })()}`;

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
        priceBlockProps={{
          originalPrice: listPrice,
          finalPrice: total,
          discountPct: discount,
          compact: true,
          perHourRate: catalogMode ? catalogHourly.perHourRate : undefined,
          perKmRate: !catalogMode && fare?.usesDistance ? fare.perKmRate : undefined,
          distanceKm: !catalogMode && fare?.usesDistance ? fare.distanceKm : undefined,
          roundTrip: Boolean(trip?.roundTrip),
          fareNote: catalogMode ? catalogHourly.fareNote : undefined
        }}
      />
    );
  }

  const features = (
    <>
      <span className={`inline-flex items-center gap-1 ${ICON_SOFT_CLASS}`}>
        <BriefcaseIcon className="h-3.5 w-3.5" /> {driver.experience || "Experienced"}
      </span>
      <span className={`inline-flex items-center gap-1 ${ICON_SOFT_CLASS}`}>
        <RouteIcon className="h-3.5 w-3.5" /> {driver.trips ?? 0} trips
      </span>
      <span className={`inline-flex items-center gap-1 ${ICON_SOFT_CLASS}`}>
        <CarIcon className="h-3.5 w-3.5" /> {vehicle}
      </span>
      <span className={`inline-flex items-center gap-1 ${ICON_SOFT_CLASS}`}>
        <CheckIcon className="h-3.5 w-3.5" /> Allowance included
      </span>
      {languages ? (
        <span className={`inline-flex items-center gap-1 ${ICON_SOFT_CLASS}`}>
          <LangIcon className="h-3.5 w-3.5" /> {languages}
        </span>
      ) : null}
    </>
  );

  return (
    <article className="cabzii-card cabzii-card-interactive cabzii-result-card-row flex flex-row items-stretch gap-3 cabzii-card-pad sm:gap-4">
      <div className="cabzii-result-card-media relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-24 sm:w-32">
        <CatalogCardImage
          src={imageSrc}
          alt={displayName}
          product={driver}
          sizes="112px"
          className="object-cover object-top"
          objectPosition="top"
        />
      </div>
      <div className="min-w-0 flex flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">{displayName}</h3>
          {rating ? <RatingBadge rating={rating} reviewCount={reviewCount} /> : null}
        </div>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{features}</div>
      </div>
      <div className="cabzii-result-card-actions flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:justify-end">
        <MmtCardPriceBlock
          originalPrice={listPrice}
          finalPrice={total}
          discountPct={discount}
          perHourRate={catalogMode ? catalogHourly?.perHourRate : undefined}
          perKmRate={!catalogMode && fare?.usesDistance ? fare.perKmRate : undefined}
          distanceKm={!catalogMode && fare?.usesDistance ? fare.distanceKm : undefined}
          roundTrip={Boolean(trip?.roundTrip)}
          fareNote={
            catalogMode
              ? catalogHourly?.fareNote
              : !fare?.usesDistance && slab?.extraHr
                ? `₹${slab.extraHr}/hr`
                : undefined
          }
        />
        <Link href={href} className="cabzii-btn cabzii-btn-primary cabzii-tap shrink-0 px-5">
          {catalogMode ? "View" : "Select"}
        </Link>
      </div>
    </article>
  );
}
