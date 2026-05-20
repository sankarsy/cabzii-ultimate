"use client";

import Link from "next/link";

export default function PackageCard({ pkg, actionText = "View Details", onAction, actionHref }) {
  const discount = pkg.discountPercentage ?? 0;
  const originalPrice = pkg.originalPrice ?? pkg.price;
  const hasDiscount = discount > 0 && originalPrice !== pkg.price;

  const btnClass =
    "inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[11px] font-bold text-white tracking-wide shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] whitespace-nowrap";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

      {/* ── Image ── */}
      <div className="relative shrink-0 overflow-hidden h-36">
        <img
          src={pkg.image ?? "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60"}
          alt={`${pkg.name} tour`}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

        {/* category tag — top left */}
        {pkg.tag && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
            {pkg.tag}
          </span>
        )}

        {/* discount badge — top right */}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
            {discount}% OFF
          </span>
        )}

        {/* duration chip — bottom left */}
        {pkg.duration && (
          <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <ClockIcon className="h-3 w-3" />
            {pkg.duration}
          </span>
        )}

        {/* vendor — bottom right */}
        {pkg.vendor && (
          <span className="absolute bottom-2 right-2.5 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow backdrop-blur-sm">
            {pkg.vendor}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-2.5 p-3.5">

        {/* Title */}
        <h3 className="line-clamp-1 text-sm font-extrabold leading-snug text-slate-900">
          {pkg.name}
        </h3>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.duration && (
            <Pill icon={<CalendarIcon className="h-3 w-3" />} label={`${pkg.duration} · per person`} />
          )}
          <Pill icon={<MapPinIcon className="h-3 w-3" />} label="100 km included" />
          <Pill icon={<InfoIcon className="h-3 w-3" />} label="Extra km charges apply" />
        </div>

        {/* Origin notice — shown only when customer city differs from base city */}
        {pkg.originNote && (
          <div className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5">
            <AlertIcon className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
            <p className="text-[10px] font-medium leading-tight text-amber-800">
              {pkg.originNote}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Starting from
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-extrabold text-blue-700">
                ₹{pkg.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-medium text-slate-400">/person</span>
            </div>
          </div>

          {actionHref ? (
            <Link href={actionHref} className={btnClass}>
              {actionText} <ArrowRightIcon className="h-3 w-3" />
            </Link>
          ) : (
            <button type="button" onClick={() => onAction?.(pkg)} className={btnClass}>
              {actionText} <ArrowRightIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Shared Pill ── */
function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      <span className="text-blue-500">{icon}</span>
      {label}
    </span>
  );
}

/* ── Icons ── */
function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}
function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function MapPinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function InfoIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
function AlertIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
function ArrowRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}