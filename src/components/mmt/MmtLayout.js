"use client";

import MmtFooter from "./MmtFooter";
import MmtHeader from "./MmtHeader";

/** Cabzii.in travel booking shell — header, content, footer */
export default function MmtLayout({ children, headerTransparent = false, className = "" }) {
  return (
    <div className={`flex min-h-screen flex-col bg-cabzii-page ${className}`}>
      <MmtHeader transparent={headerTransparent} />
      <div className="flex-1">{children}</div>
      <MmtFooter />
    </div>
  );
}
