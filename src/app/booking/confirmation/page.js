"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MmtLayout from "../../../components/mmt/MmtLayout";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "—";
  const title = searchParams.get("title") || "Your trip";
  const total = searchParams.get("total");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
      <h1 className="text-2xl font-bold text-slate-900">Booking confirmed</h1>
      <p className="mt-2 text-sm text-slate-600">Confirmation sent to your email</p>
      <p className="mt-6 rounded-xl border border-slate-200 bg-white px-6 py-4 text-left shadow-sm">
        <span className="text-xs font-semibold uppercase text-slate-500">Booking ID</span>
        <span className="mt-1 block text-2xl font-extrabold tracking-wide text-[var(--emt-primary)]">{bookingId}</span>
      </p>
      <p className="mt-4 font-semibold text-slate-800">{title}</p>
      {total ? <p className="text-sm text-slate-600">Paid: ₹{Number(total).toLocaleString("en-IN")}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          Download ticket
        </button>
        <Link href="/my-bookings" className="rounded-full bg-[var(--emt-primary)] px-5 py-2 text-sm font-bold text-white">
          My bookings
        </Link>
        <Link href="/" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          Home
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="py-16 text-center">Loading…</div>}>
        <ConfirmationContent />
      </Suspense>
    </MmtLayout>
  );
}
