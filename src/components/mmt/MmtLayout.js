"use client";

import { Suspense } from "react";
import MmtFooter from "./MmtFooter";
import MmtHeader from "./MmtHeader";
import RouteScrollReset from "../layout/RouteScrollReset";

/** Cabzii.in travel booking shell — single white header, content, footer */
export default function MmtLayout({ children, className = "" }) {
  return (
    <div className={`cabzii-page-shell flex min-h-screen flex-col overflow-x-hidden bg-cabzii-page ${className}`}>
      <RouteScrollReset />
      <Suspense fallback={<div className="cabzii-home-header-spacer shrink-0" aria-hidden />}>
        <MmtHeader />
      </Suspense>
      <div className="cabzii-home-header-spacer shrink-0" aria-hidden />
      <div className="flex-1">{children}</div>
      <MmtFooter />
    </div>
  );
}
