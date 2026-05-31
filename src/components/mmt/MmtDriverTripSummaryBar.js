"use client";

import Link from "next/link";
import { driverPackageLabel, driverTripSummaryLabel, driverTripTypeLabel } from "../../lib/driverTrip";

export default function MmtDriverTripSummaryBar({ trip }) {
  const label = driverTripTypeLabel(trip);
  const pkg = driverPackageLabel(trip.packageId);

  return (
    <div className="bg-mmt-header text-mmt-header-fg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</p>
          <h1 className="flex items-start gap-2 text-lg font-bold sm:text-xl">
            <span className="mt-0.5 shrink-0" aria-hidden="true">
              👤
            </span>
            {driverTripSummaryLabel(trip)}
          </h1>
          <p className="mt-1 text-xs opacity-90">Package: {pkg}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span>📅 {trip.date}</span>
          <span>🕐 {trip.time}</span>
          <Link href="/" className="rounded-full bg-white/10 px-3 py-1.5 font-semibold transition hover:bg-white/20">
            ✏️ Modify
          </Link>
        </div>
      </div>
    </div>
  );
}
