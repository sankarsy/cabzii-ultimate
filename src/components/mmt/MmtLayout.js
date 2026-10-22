"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import MmtFooter from "./MmtFooter";
import MmtHeader from "./MmtHeader";
import RouteScrollReset from "../layout/RouteScrollReset";

/** Cabzii.in travel booking shell — single white header, content, footer */
export default function MmtLayout({ children, className = "" }) {
  const pathname = usePathname();
  const reviewBooking = pathname === "/cabs/passenger";
  const hideSpacer = reviewBooking ? "hidden" : "";

  return (
    <div className={`cabzii-page-shell flex min-h-screen flex-col overflow-x-hidden bg-cabzii-page ${className}`}>
      <RouteScrollReset />
      <Suspense fallback={<div className={`cabzii-home-header-spacer shrink-0 ${hideSpacer}`} aria-hidden />}>
        <MmtHeader hidden={reviewBooking} />
      </Suspense>
      <div className={`cabzii-home-header-spacer shrink-0 ${hideSpacer}`} aria-hidden />
      <div className="min-h-min grow">{children}</div>
      <div className={reviewBooking ? "hidden" : ""}>
        <MmtFooter />
      </div>
    </div>
  );
}
