"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PackageOptionCard from "./PackageOptionCard";
import { buildFareSlabs, num } from "../lib/cabFare";

const FALLBACK_CAB_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80";

function formatRating(cab) {
  if (cab.rating == null || cab.rating === "") return null;
  const n = Number(cab.rating);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

export default function CabCard({ cab, onBook, bookHref }) {
  const discount = num(cab.discountPercentage, 0);
  const imageSrc = (cab.image && String(cab.image).trim()) || FALLBACK_CAB_IMAGE;
  const features = Array.isArray(cab.features) ? cab.features : [];
  const hasAc = features.some((f) => /^(ac|a\/c|air\s*condition)/i.test(String(f).trim()));
  const amenityLabel = hasAc ? "AC" : features[0] ? String(features[0]) : "—";
  const ratingText = formatRating(cab);
  const reviewCount = cab.reviewCount ?? cab.reviews ?? 234;

  const fareSlabs = useMemo(
    () => buildFareSlabs(cab),
    [cab._id, cab.hourlyRate, cab.dayRate, cab.price, cab.discountPercentage]
  );
  const [selectedPackageId, setSelectedPackageId] = useState("local_4hr");
  const [serviceTab, setServiceTab] = useState("local");

  const visiblePackages = fareSlabs.filter((pkg) => pkg.group === serviceTab);
  const d = Math.min(99, Math.max(0, discount));

  const handleServiceTab = (tab) => {
    setServiceTab(tab);
    const first = fareSlabs.find((p) => p.group === tab);
    if (first) setSelectedPackageId(first.id);
  };

  const bookButtonClass =
    "inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[#0056D2] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0047b3]";

  const BookAction = bookHref ? (
    <Link href={bookHref} className={bookButtonClass}>
      Book Now <span aria-hidden>→</span>
    </Link>
  ) : (
    <button type="button" onClick={() => onBook?.(cab)} className={bookButtonClass}>
      Book Now <span aria-hidden>→</span>
    </button>
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative shrink-0 bg-slate-50">
        <img src={imageSrc} alt={cab.title || "Cab"} className="h-28 w-full object-cover object-center sm:h-32" />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-600/95 px-2 py-0.5 text-[10px] font-semibold text-white">
          <CarIcon className="h-3 w-3" />
          {cab.type}
        </span>
        {ratingText ? (
          <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800 shadow-sm">
            {ratingText} ★ <span className="font-normal text-slate-500">({reviewCount})</span>
          </span>
        ) : null}
        {d > 0 ? (
          <span className="absolute bottom-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {d}% OFF
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{cab.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#0056D2]/80">by {cab.vendor}</p>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-0.5 font-medium">
            <SeatIcon className="h-3 w-3 text-[#0056D2]" />
            {cab.seats ?? "—"} Seats
          </span>
          <span className="inline-flex items-center gap-0.5 font-medium">
            <SnowflakeIcon className="h-3 w-3 text-[#0056D2]" />
            {amenityLabel}
          </span>
          <span className="inline-flex items-center gap-0.5 font-medium">
            <PersonIcon className="h-3 w-3 text-[#0056D2]" />
            Driver
          </span>
        </div>

        <div className="mt-2.5 inline-flex w-full rounded-full border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => handleServiceTab("local")}
            className={`flex-1 rounded-full py-1 text-[10px] font-semibold transition ${
              serviceTab === "local" ? "bg-[#0056D2] text-white" : "text-slate-600"
            }`}
          >
            Local
          </button>
          <button
            type="button"
            onClick={() => handleServiceTab("outstation")}
            className={`flex-1 rounded-full py-1 text-[10px] font-semibold transition ${
              serviceTab === "outstation" ? "bg-[#0056D2] text-white" : "text-slate-600"
            }`}
          >
            Outstation
          </button>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {visiblePackages.map((pkg) => (
            <PackageOptionCard
              key={pkg.id}
              pkg={pkg}
              selected={selectedPackageId === pkg.id}
              discount={d}
              compact
              onSelect={() => setSelectedPackageId(pkg.id)}
            />
          ))}
        </div>

        <div className="mt-2 flex items-center justify-end border-t border-slate-100 pt-2">
          <span className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-600">
            <CheckIcon className="h-3 w-3" />
            Verified vendor
          </span>
        </div>

        <div className="mt-auto pt-2.5">{BookAction}</div>
      </div>
    </article>
  );
}

function CarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <path d="M3 11h18v6a1 1 0 0 1-1 1h-1M3 11v6a1 1 0 0 0 1 1h1" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function SeatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M5 13h4a3 3 0 0 1 3 3v3H5v-6zM12 16h6l1 3h-7" />
    </svg>
  );
}

function PersonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SnowflakeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M12 2l3 4M12 2L9 6M12 22l3-4M12 22l-3-4M2 12h20M2 12l4 3M2 12l4-3M22 12l-4 3M22 12l-4-3" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
