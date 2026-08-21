"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bus } from "lucide-react";
import BusCheckoutFlow from "../../../components/bus/BusCheckoutFlow";
import { resolveBusTrip } from "../../../lib/busCatalog";

function BusSeatsSkeleton() {
  return (
    <div className="fixed inset-0 z-[120] animate-pulse bg-[#f3f4f8] p-6">
      <div className="h-12 rounded bg-white" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-[28rem] rounded-xl bg-white" />
        <div className="h-[28rem] rounded-xl bg-white" />
      </div>
    </div>
  );
}

function BusSeatsContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolveBusTrip({ id: tripId, from, to, date }).then((t) => {
      if (cancelled) return;
      setTrip(t);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tripId, from, to, date]);

  const backQuery = searchParams.toString().replace(/&?id=[^&]*/g, "").replace(/^&/, "");
  const backHref = `/buses/results?${backQuery}`;

  if (loading) return <BusSeatsSkeleton />;

  if (!trip) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-white p-8 text-center">
        <Bus className="h-8 w-8 text-slate-400" aria-hidden />
        <p className="mt-3 text-lg font-bold text-slate-900">Bus trip not found</p>
        <Link href="/buses/results" className="mt-4 text-sm font-semibold text-[#d84e55]">
          Search buses
        </Link>
      </div>
    );
  }

  return <BusCheckoutFlow trip={trip} searchParams={searchParams} backHref={backHref} />;
}

export default function BusSeatsPage() {
  return (
    <Suspense fallback={<BusSeatsSkeleton />}>
      <BusSeatsContent />
    </Suspense>
  );
}
