"use client";

import Link from "next/link";
import MmtLayout from "../../components/mmt/MmtLayout";

export default function BusesPage() {
  return (
    <MmtLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Bus booking</h1>
        <p className="mt-2 text-slate-600">
          Intercity bus search is coming soon on cabzii.in. Book cabs or tempo travellers for group travel today.
        </p>
        <Link href="/cabs" className="mt-6 inline-block rounded-full bg-[var(--emt-primary)] px-8 py-3 font-bold text-white">
          Book a cab
        </Link>
      </div>
    </MmtLayout>
  );
}
