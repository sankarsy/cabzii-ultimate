"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MmtLayout from "../../../components/mmt/MmtLayout";

function RedirectToCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("step", "passenger");
    router.replace(`/buses/seats?${q.toString()}`);
  }, [router, searchParams]);
  return <div className="py-16 text-center text-sm text-slate-500">Opening passenger details…</div>;
}

export default function BusPassengerPage() {
  return (
    <MmtLayout>
      <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading…</div>}>
        <RedirectToCheckout />
      </Suspense>
    </MmtLayout>
  );
}
