"use client";

import Link from "next/link";

export default function PackageCard({ pkg, actionText = "View Details", onAction, actionHref }) {
  return (
    <article className="flex h-full min-h-[220px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <img
          src={pkg.image ?? "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60"}
          alt={`${pkg.name} tour`}
          className="h-36 w-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900">{pkg.name}</h3>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {pkg.discountPercentage ?? 0}% OFF
          </span>
        </div>
        <p className="text-xs text-gray-600">By {pkg.vendor}</p>
        <p className="text-xs text-gray-600">{pkg.duration}/ one person</p>
        <p className="text-[11px] text-slate-500">Applicable distance: 100 km, extra km charges applicable.</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Starting from</p>
          <p className="text-xs text-slate-400 line-through">₹{(pkg.originalPrice ?? pkg.price).toLocaleString("en-IN")}</p>
          <p className="text-base font-bold text-sky-700">
            ₹{pkg.price.toLocaleString("en-IN")} <span className="text-xs font-semibold text-slate-500">/person</span>
          </p>
        </div>
        {actionHref ? (
          <Link
            href={actionHref}
            className="rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50"
          >
            {actionText}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onAction?.(pkg)}
            className="rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50"
          >
            {actionText}
          </button>
        )}
      </div>
    </article>
  );
}
