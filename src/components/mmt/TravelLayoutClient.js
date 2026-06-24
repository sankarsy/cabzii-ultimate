"use client";

import MmtLayout from "./MmtLayout";

/** Wraps catalog/booking pages with the same white home header + footer as the homepage. */
export default function TravelLayoutClient({ children }) {
  return <MmtLayout>{children}</MmtLayout>;
}
