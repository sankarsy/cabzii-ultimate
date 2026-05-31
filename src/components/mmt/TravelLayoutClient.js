"use client";

import MmtLayout from "./MmtLayout";

/** Wraps catalog/booking pages with cabzii.in header + footer (same as home & cabs). */
export default function TravelLayoutClient({ children }) {
  return <MmtLayout>{children}</MmtLayout>;
}
