"use client";

import { Suspense } from "react";
import CallDriverBookingFlow from "../../../components/call-driver/CallDriverBookingFlow";

export default function CallDriverBookPage() {
  return (
    <Suspense fallback={<div className="section-shell py-16 text-center text-sm text-slate-500">Loading booking…</div>}>
      <CallDriverBookingFlow />
    </Suspense>
  );
}
