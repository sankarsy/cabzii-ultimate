"use client";

import MmtFooter from "./MmtFooter";
import MmtHeader from "./MmtHeader";

/** Cabzii.in travel booking shell — header, content, footer */
export default function MmtLayout({ children, headerTransparent = false, homeLayout = false, className = "" }) {
  return (
    <div className={`cabzii-page-shell flex min-h-screen flex-col overflow-x-hidden bg-cabzii-page ${className}`}>
      <MmtHeader transparent={headerTransparent} homeLayout={homeLayout} />
      {homeLayout ? (
        <div className="cabzii-home-header-spacer shrink-0" aria-hidden />
      ) : !headerTransparent ? (
        <div className="h-14 shrink-0 sm:h-[4.25rem]" aria-hidden />
      ) : null}
      <div className="flex-1">{children}</div>
      <MmtFooter />
    </div>
  );
}
